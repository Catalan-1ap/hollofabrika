import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView, getProductsCollection } from "../categories.setup.js";
import { getCategory } from "../categories.services.js";
import { transaction } from "../../../infrastructure/arangoUtils.js";


export const createCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["createCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            isCategoryExists
        } = await getCategory(context.db, args.name);
        if (isCategoryExists)
            throw makeApplicationError("CreateCategory_CategoryExists", GqlErrorCode.BadRequest);

        const productsCollection = getProductsCollection(context.db, crypto.randomUUID());

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const newCategory = await trx.step(() => categoriesCollection.save({
                    name: args.name,
                    collectionName: productsCollection.name,
                    attributes: []
                }, { returnNew: true })
            );
            await trx.step(() => productsCollection.create());
            await trx.step(() => getAllProductsView(context.db).updateProperties({
                links: {
                    [productsCollection.name]: {
                        analyzers: ["identity"],
                        includeAllFields: true,
                        inBackground: true
                    }
                }
            }));

            return {
                name: newCategory.new!.name,
                attributes: newCategory.new!.attributes
            };
        });
    };