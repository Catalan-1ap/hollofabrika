import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { querySingle, transaction, TransactionResultOptions } from "../../../infrastructure/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { removeAttributes } from "./deleteProductMutation.js";
import { addAttributes } from "./createProductMutation.js";
import { nanoid } from "nanoid";
import path from "path";
import { productsCoversPath } from "../../../infrastructure/constants.js";
import fs from "fs";
import { catcherDeleteFile, finalizeWritableStream } from "../../../infrastructure/filesUtils.js";
import { pipeline } from "stream/promises";


export const updateProductMutation: GqlMutationResolvers<HollofabrikaContext>["updateProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const [collection, key] = args.id.split("/");
        const productToInsert: Partial<DbProduct> = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes
        };
        const productsCollection = context.db.collection(collection);
        const categoriesCollection = getCategoriesCollection(context.db);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const transactionResultOptions: TransactionResultOptions = {
                finalizers: [],
                catchers: []
            };

            const { item: old } = await trx.step(() =>
                querySingle<DbProduct>(context.db, aql`
                    for doc in ${productsCollection}
                    filter doc._key == ${key}
                    return doc
                `)
            );

            if (!old)
                throw makeApplicationError("UpdateProduct_ProductNotExists", GqlErrorCode.BadRequest);

            if (args.product.cover) {
                const coverFile = await args.product.cover.file;

                productToInsert.coverName = old.coverName ?? `${nanoid()}${path.extname(coverFile?.filename ?? "somethingwentwrong")}`;

                const coverPath = path.join(
                    productsCoversPath,
                    productToInsert.coverName
                );
                const localCoverStream = fs.createWriteStream(coverPath);

                transactionResultOptions.finalizers?.push(finalizeWritableStream(localCoverStream));
                transactionResultOptions.catchers?.push(catcherDeleteFile(coverPath));

                await pipeline(coverFile.createReadStream(), localCoverStream);
            }

            const { item: result } = await trx.step(() =>
                querySingle<{
                    beforeUpdate: Document<DbProduct>,
                    afterUpdate: Document<DbProduct>
                } | undefined>(context.db, aql`
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

            removeAttributes(category, result.beforeUpdate);
            addAttributes(category, result.afterUpdate);

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: result.afterUpdate._id,
                    cover: result.afterUpdate.coverName,
                    category: category.name,
                    description: result.afterUpdate.description,
                    name: result.afterUpdate.name,
                    price: result.afterUpdate.price,
                    attributes: result.afterUpdate.attributes
                }
            };
        });
    };