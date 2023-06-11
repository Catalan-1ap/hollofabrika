import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../categories.services.js";
import { transaction } from "../../../infrastructure/arangoUtils.js";


export const deleteCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["deleteCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            category,
            isCategoryExists
        } = await getCategory(context.db, args.name);
        if (!isCategoryExists)
            throw makeApplicationError("DeleteCategory_CategoryNotExists", GqlErrorCode.BadRequest);

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const oldCategory = await trx.step(() => categoriesCollection.remove({
                    _key: category._key
                }, { returnOld: true })
            );
            await trx.step(() => context.db.collection(category.collectionName).drop());

            return {
                name: oldCategory.old!.name,
                attributes: oldCategory.old!.attributes
            };
        });
    };