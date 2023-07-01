import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../categories.services.js";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { aql } from "arangojs";
import { DbCategory } from "../../../infrastructure/dbTypes.js";


export const updateCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["updateCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            category,
            isCategoryExists
        } = await getCategory(context.db, args.originalName);
        if (!isCategoryExists)
            throw makeApplicationError("UpdateCategory_CategoryNotExists", GqlErrorCode.BadRequest);

        const categoryToUpdate: Partial<DbCategory> = {
            name: args.newName
        };

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const afterUpdate = await trx.step(() =>
                querySingle(context.db, aql`
                    update ${category}
                    with ${categoryToUpdate} in ${categoriesCollection}
                    options { ignoreRevs: false }
                    return NEW
                `)
            );

            return {
                data: {
                    name: afterUpdate.name,
                    attributes: afterUpdate.attributes
                }
            };
        });
    };