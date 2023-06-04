import { GqlErrorCode, GqlMutationResolvers, GqlRole, GqlSuccessCode } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { getProductsCollection } from "../categories.setup.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../categories.services.js";


export const deleteCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["deleteCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            category,
            isCategoryExists
        } = await getCategory(context.db, args.name);
        if (isCategoryExists)
            throw makeApplicationError("DeleteCategory_CategoryNotExists", GqlErrorCode.BadRequest);

        await getProductsCollection(context.db, category.collectionName).drop();
        await categoriesCollection.remove({
            _key: category._key
        });

        return {
            code: GqlSuccessCode.Oke
        };
    };