import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { removeAttributes, removeCovers } from "./deleteProductMutation.js";
import { addAttributes, saveCovers } from "./createProductMutation.js";
import { TransactionRecovery } from "../../../infrastructure/transactionRecovery.js";


export const updateProductMutation: GqlMutationResolvers<HollofabrikaContext>["updateProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const [collection, key] = args.id.split("/");
        const productToInsert: Partial<DbProduct> = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes,
            coversFileNames: []
        };
        const productsCollection = context.db.collection(collection);
        const categoriesCollection = getCategoriesCollection(context.db);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const { item: old } = await trx.step(() =>
                querySingle<DbProduct>(context.db, aql`
                    for doc in ${productsCollection}
                    filter doc._key == ${key}
                    return doc
                `)
            );

            if (!old)
                throw makeApplicationError("UpdateProduct_ProductNotExists", GqlErrorCode.BadRequest);

            await removeCovers(old
                .coversFileNames
                .filter(x => args.product.coversNamesToDelete?.includes(x))
            );

            const saveCoversResult = await saveCovers(args.product.covers ?? []);
            productToInsert.coversFileNames?.push(...saveCoversResult.coversFileNames);

            productToInsert.coversFileNames?.push(...old
                .coversFileNames
                .filter(x => !args.product.coversNamesToDelete?.includes(x))
            );

            const { item: result } = await trx.step(() =>
                querySingle<{
                    beforeUpdate: Document<DbProduct>,
                    afterUpdate: Document<DbProduct>
                }>(context.db, aql`
                    update ${key} with ${productToInsert} in ${productsCollection}
                    options { ignoreErrors: true }
                    return { beforeUpdate: OLD, afterUpdate: NEW }
                `)
            );

            const { item: category } = await trx.step(() =>
                querySingle<Document<DbCategory>>(context.db, aql`
                    for doc in ${categoriesCollection}
                    filter doc.collectionName == ${collection}
                    return doc
                `)
            );

            if (productToInsert.attributes) {
                removeAttributes(category, result.beforeUpdate.attributes);
                addAttributes(category, result.afterUpdate.attributes);

                await trx.step(() => context.db.query(aql`
                    update ${category}
                    with ${category} in ${categoriesCollection}
                    options { ignoreRevs: false }
                `));
            }

            return {
                data: {
                    id: result.afterUpdate._id,
                    covers: result.afterUpdate.coversFileNames,
                    category: category.name,
                    description: result.afterUpdate.description,
                    name: result.afterUpdate.name,
                    price: result.afterUpdate.price,
                    attributes: result.afterUpdate.attributes
                },
                recoveryActions: new TransactionRecovery().mergeAll([
                    saveCoversResult.transactionRecovery
                ])
            };
        });
    };