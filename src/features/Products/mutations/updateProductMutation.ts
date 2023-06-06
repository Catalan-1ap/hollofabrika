import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { removeAttributes } from "./deleteProductMutation.js";
import { addAttributes } from "./createProductMutation.js";


export const updateProductMutation: GqlMutationResolvers<HollofabrikaContext>["updateProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const [collection, key] = args.id.split("/");
        const productToInsert = args.product satisfies DbProduct;
        const productsCollection = context.db.collection(collection);
        const categoriesCollection = getCategoriesCollection(context.db);

        const trx = await context.db.beginTransaction({
            write: [productsCollection],
            exclusive: [categoriesCollection]
        });

        try {
            const { item: { before, after } } = await trx.step(() => querySingle<{
                before: Document<DbProduct>,
                after: Document<DbProduct>
            }>(context.db, aql`
                update ${key} with ${productToInsert} in ${productsCollection}
                options { ignoreErrors: true }
                return { before: OLD, after: NEW }
            `));
            if (!after)
                throw makeApplicationError("UpdateProduct_ProductNotExists", GqlErrorCode.BadRequest);

            const { item: category } = await trx.step(() =>
                querySingle<Document<DbCategory>>(context.db, aql`
                    for doc in ${categoriesCollection}
                    filter doc.collectionName == ${collection}
                    return doc
                `)
            );

            removeAttributes(category, before);
            addAttributes(category, after);

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            await trx.commit();
            return {
                id: after._id,
                name: after.name,
                price: after.price,
                attributes: after.attributes
            };
        } catch (e) {
            await trx.abort();
            throw e;
        }
    };