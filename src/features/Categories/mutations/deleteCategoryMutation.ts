import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { queryCategory } from "../categories.services.js";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";


export const deleteCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["deleteCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            category,
            isCategoryExists
        } = await queryCategory(context.db, args.name);
        if (!isCategoryExists)
            throw makeApplicationError("DeleteCategory_CategoryNotExists", GqlErrorCode.BadRequest);

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const oldCategory = await trx.step(() =>
                querySingle<Document<DbCategory>>(context.db, aql`
                    remove ${category} in ${categoriesCollection}
                    options { ignoreRevs: false }
                    return OLD
                `)
            );

            await trx.step(() => context.db.collection(category.collectionName).drop());

            return {
                data: {
                    name: oldCategory.name,
                    attributes: oldCategory.attributes
                }
            };
        });
    };