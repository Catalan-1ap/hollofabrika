import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlRole, GqlSuccessCode } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView, getProductsCollection } from "../categories.setup.js";
import { getCategory } from "../categories.services.js";


export const createCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["createCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            isCategoryExists
        } = await getCategory(context.db, args.name);
        if (isCategoryExists)
            throw makeApplicationError("CreateCategory_CategoryExists", GqlErrorCode.BadRequest);

        const productsCollection = getProductsCollection(context.db, args.name);
        await categoriesCollection.save({
            name: args.name,
            collectionName: productsCollection.name
        });
        await productsCollection.create();
        await getAllProductsView(context.db).updateProperties({
            links: {
                [productsCollection.name]: {
                    analyzers: ["identity"],
                    includeAllFields: true
                }
            }
        });

        return {
            code: GqlSuccessCode.Oke
        };
    };