import { GqlErrorCode, GqlMutationResolvers, GqlRole, GqlSuccessCode } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { getCategoryCollection } from "../categories.setup.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const deleteCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["deleteCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const categoryCollection = getCategoryCollection(context.db, args.name);

        if (!await categoryCollection.exists())
            throw makeApplicationError("CreateCategory_CategoryNotExists", GqlErrorCode.BadRequest);

        await categoryCollection.drop();

        return {
            code: GqlSuccessCode.Oke
        };
    };