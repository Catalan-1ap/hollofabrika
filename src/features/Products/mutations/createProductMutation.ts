import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../../Categories/categories.services.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { transaction, TransactionResultOptions } from "../../../infrastructure/arangoUtils.js";
import { saveProductCover } from "../products.services.js";
import { mergeTransactionResultOptions } from "../../../infrastructure/utils.js";


export const createProductMutation: GqlMutationResolvers<HollofabrikaContext>["createProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            category,
            categoriesCollection,
            isCategoryExists
        } = await getCategory(context.db, args.category);
        if (!isCategoryExists)
            throw makeApplicationError("CreateProduct_CategoryNotExists", GqlErrorCode.BadRequest);

        const productToInsert: DbProduct = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes,
            coversFileNames: []
        };

        addAttributes(category, productToInsert);

        const productsCollection = context.db.collection<DbProduct>(category.collectionName);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const transactionResultOptions: TransactionResultOptions = {
                finalizers: [],
                catchers: []
            };

            for (const cover of args.product.covers ?? []) {
                const result = await saveProductCover(cover.file);

                productToInsert.coversFileNames.push(result.coverName);

                mergeTransactionResultOptions(transactionResultOptions, result.transactionResultOptions);
            }

            const newProduct = await trx.step(() =>
                productsCollection.save(productToInsert, { returnNew: true })
            );

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: newProduct.new!._id,
                    covers: newProduct.new!.coversFileNames,
                    category: category.name,
                    description: newProduct.new!.description,
                    name: newProduct.new!.name,
                    price: newProduct.new!.price,
                    attributes: newProduct.new!.attributes
                },
                ...transactionResultOptions
            };
        });
    };

export function addAttributes(category: DbCategory, product: DbProduct) {
    for (let attribute of product.attributes) {
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