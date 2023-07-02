import { GqlErrorCode, GqlMutationResolvers, GqlRole, Scalars } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { queryCategory } from "../../Categories/categories.services.js";
import { DbCategory, DbProduct, DbProductAttribute } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { saveProductCover } from "../products.services.js";
import { TransactionRecovery } from "../../../infrastructure/transactionRecovery.js";
import { Document } from "arangojs/documents.js";


export const createProductMutation: GqlMutationResolvers<HollofabrikaContext>["createProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            category,
            categoriesCollection,
            isCategoryExists
        } = await queryCategory(context.db, args.category);
        if (!isCategoryExists)
            throw makeApplicationError("CreateProduct_CategoryNotExists", GqlErrorCode.BadRequest);

        const productToInsert: Required<DbProduct> = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes,
            coversFileNames: []
        };
        addAttributes(category, productToInsert.attributes);
        const productsCollection = context.db.collection<DbProduct>(category.collectionName);

        const saveCoversResult = await saveCovers(args.product.covers ?? []);
        productToInsert.coversFileNames.push(...saveCoversResult.coversFileNames);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const newProduct = await trx.step(() =>
                querySingle<Document<DbProduct>>(context.db, aql`
                    insert ${productToInsert} in ${productsCollection}
                    options { ignoreErrors: true }
                    return NEW
                `)
            );

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: newProduct._id,
                    covers: newProduct.coversFileNames,
                    category: category.name,
                    description: newProduct.description,
                    name: newProduct.name,
                    price: newProduct.price,
                    attributes: newProduct.attributes
                },
                recoveryActions: new TransactionRecovery().mergeAll([
                    saveCoversResult.transactionRecovery
                ])
            };
        });
    };


export function addAttributes(category: DbCategory, attributes: DbProductAttribute[]) {
    for (let attribute of attributes) {
        const categoryAttribute = category.attributes
            .find(x => x.name === attribute.name && x.value === attribute.value);

        if (categoryAttribute) {
            categoryAttribute.count++;
            continue;
        }

        category.attributes.push({
            ...attribute,
            count: 1
        });
    }
}


export async function saveCovers(covers: Scalars["Upload"][]) {
    const transactionRecovery = new TransactionRecovery();
    const coversFileNames: string[] = [];

    for (const cover of covers) {
        const result = await saveProductCover(cover.file);

        coversFileNames.push(result.coverName);

        transactionRecovery.merge(result.transactionRecovery);
    }

    return {
        coversFileNames,
        transactionRecovery
    };
}