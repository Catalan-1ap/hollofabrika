import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView, getProductsCollection } from "../categories.setup.js";
import { getCategory } from "../categories.services.js";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import * as crypto from "crypto";


export const createCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["createCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            isCategoryExists
        } = await getCategory(context.db, args.name);
        if (isCategoryExists)
            throw makeApplicationError("CreateCategory_CategoryExists", GqlErrorCode.BadRequest);

        const productsCollection = getProductsCollection(context.db, crypto.randomUUID());
        const categoryToInsert: DbCategory = {
            name: args.name,
            collectionName: productsCollection.name,
            attributes: []
        };

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const newCategory = await trx.step(() =>
                querySingle<Document<DbCategory>>(context.db, aql`
                    insert ${categoryToInsert} in ${categoriesCollection}
                    return NEW
                `)
            );

            await trx.step(() => productsCollection.create());
            await trx.step(() => getAllProductsView(context.db).updateProperties({
                links: {
                    [productsCollection.name]: {
                        analyzers: ["identity"],
                        includeAllFields: true,
                        inBackground: true
                    }
                }
            }));

            return {
                data: {
                    name: newCategory.name,
                    attributes: newCategory.attributes,
                }
            };
        });
    };