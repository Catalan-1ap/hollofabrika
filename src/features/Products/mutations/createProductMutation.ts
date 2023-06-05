import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../../Categories/categories.services.js";


export const createProductMutation: GqlMutationResolvers<HollofabrikaContext>["createProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            category,
            isCategoryExists
        } = await getCategory(context.db, args.category);
        if (!isCategoryExists)
            throw makeApplicationError("CreateProduct_CategoryNotExists", GqlErrorCode.BadRequest);

        const newProduct = await context.db
            .collection(category.collectionName)
            .save({
                name: args.product.name,
                price: args.product.price,
                attributes: args.product.attributes
            }, { returnNew: true });

        return {
            id: newProduct.new!._id,
            name: newProduct.new!.name,
            price: newProduct.new!.price,
        };
    };