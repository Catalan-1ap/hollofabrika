import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../../Categories/categories.services.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";


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
            description: args.product.description,
            price: args.product.price,
            attributes: args.product.attributes
        };

        addAttributes(category, productToInsert);

        const productsCollection = context.db.collection<DbProduct>(category.collectionName);
        const trx = await context.db.beginTransaction({
            write: [productsCollection],
            exclusive: [categoriesCollection]
        });

        try {
            const newProduct = await trx.step(() =>
                productsCollection.save(productToInsert, { returnNew: true })
            );
            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            await trx.commit();
            return {
                id: newProduct.new!._id,
                description: newProduct.new!.description,
                name: newProduct.new!.name,
                price: newProduct.new!.price,
                attributes: newProduct.new!.attributes
            };
        } catch (e) {
            await trx.abort();
            throw e;
        }
    };

export function addAttributes(category: DbCategory, product: DbProduct) {
    category.attributes ??= {};

    for (let [key, value] of Object.entries(product.attributes ?? {})) {
        const existed = category.attributes?.[key];

        if (!existed) {
            category.attributes[key] = [{
                value: value,
                count: 1
            }];
            continue;
        }

        const sameValue = existed.filter(x => x.value === value)[0];
        if (sameValue) {
            sameValue.count++;
            continue;
        }

        existed.push({
            value: value,
            count: 1
        });
    }
}