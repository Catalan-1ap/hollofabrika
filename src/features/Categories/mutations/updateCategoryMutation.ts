import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../categories.services.js";


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

        const afterUpdate = await categoriesCollection.update({ _key: category._key }, {
            name: args.newName
        }, { returnNew: true });

        return {
            name: afterUpdate.new!.name,
            attributes: afterUpdate.new!.attributes
        };
    };