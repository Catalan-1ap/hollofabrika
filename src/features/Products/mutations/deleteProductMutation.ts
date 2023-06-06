import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { Document } from "arangojs/documents.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";


export const deleteProductMutation: GqlMutationResolvers<HollofabrikaContext>["deleteProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const [collection, key] = args.id.split("/");
        const productsCollection = context.db.collection(collection);
        const categoriesCollection = getCategoriesCollection(context.db);

        const trx = await context.db.beginTransaction({
            write: [productsCollection],
            exclusive: [categoriesCollection]
        });

        try {
            const { item: oldProduct } = await trx.step(() =>
                querySingle<Document<DbProduct>>(context.db, aql`
                    remove ${key} in ${productsCollection}
                    options { ignoreErrors: true }
                    return OLD
                `)
            );
            if (!oldProduct)
                throw makeApplicationError("DeleteProduct_ProductNotExists", GqlErrorCode.BadRequest);

            const { item: category } = await trx.step(() =>
                querySingle<Document<DbCategory>>(context.db, aql`
                    for doc in ${categoriesCollection}
                    filter doc.collectionName == ${collection}
                    return doc
                `)
            );

            removeAttributes(category, oldProduct);

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            await trx.commit();
            return {
                id: oldProduct._id,
                name: oldProduct.name,
                price: oldProduct.price,
                attributes: oldProduct.attributes
            };
        } catch (e) {
            await trx.abort();
            throw e;
        }
    };

export function removeAttributes(category: DbCategory, product: DbProduct) {
    category.attributes ??= {};

    for (const [key, value] of Object.entries(product.attributes ?? {})) {
        const attributes = category.attributes?.[key];

        if (!attributes)
            continue;

        const attribute = attributes.filter(x => x.value === value)[0];
        attribute.count--;

        if (attribute.count <= 0)
            category.attributes[key] = attributes.filter(x => x !== attribute);
    }
}