import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { aql } from "arangojs";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
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

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
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
                options { ignoreRevs: false, keepNull: false }
            `));

            return {
                id: oldProduct._id,
                category: category.name,
                description: oldProduct.description,
                name: oldProduct.name,
                price: oldProduct.price,
                attributes: oldProduct.attributes
            };
        })
    };

export function removeAttributes(category: DbCategory, product: DbProduct) {
    for (let attribute of product.attributes) {
        const categoryAttributeIndex = category.attributes
            .findIndex(x => x.name === attribute.name);
        const categoryAttribute = category.attributes[categoryAttributeIndex];

        if (!categoryAttribute)
            continue;

        categoryAttribute.count--;

        if (categoryAttribute.count <= 0)
            category.attributes.splice(categoryAttributeIndex, 1);
    }
}