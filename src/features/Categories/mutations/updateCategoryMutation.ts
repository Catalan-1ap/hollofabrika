import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../categories.services.js";
import { transaction } from "../../../infrastructure/arangoUtils.js";


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

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const afterUpdate = await trx.step(() =>
                categoriesCollection.update(category, {
                    name: args.newName
                }, { returnNew: true, ignoreRevs: false })
            );

            return {
                data: {
                    name: afterUpdate.new!.name,
                    attributes: afterUpdate.new!.attributes
                }
            };
        });
    };