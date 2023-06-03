import { GqlErrorCode, GqlMutationResolvers, GqlRole, GqlSuccessCode } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { getCategoryCollection } from "../categories.setup.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const updateCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["updateCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const categoryCollection = getCategoryCollection(context.db, args.originalName);

        if (!await categoryCollection.exists())
            throw makeApplicationError("UpdateCategory_CategoryNotExists", GqlErrorCode.BadRequest);

        await categoryCollection.rename(getCategoryCollection(context.db, args.newName).name);

        return {
            code: GqlSuccessCode.Oke
        };
    };