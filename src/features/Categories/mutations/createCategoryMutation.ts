import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlRole, GqlSuccessCode } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getCategoryCollection } from "../categories.setup.js";


export const createCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["createCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const categoryCollection = getCategoryCollection(context.db, args.name);

        if (await categoryCollection.exists())
            throw makeApplicationError("CreateCategory_CategoryExists", GqlErrorCode.BadRequest);

        await categoryCollection.create();

        return {
            code: GqlSuccessCode.Oke
        };
    };