import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { getCategoryCollection } from "../../Categories/categories.setup.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const createProductMutation: GqlMutationResolvers<HollofabrikaContext>["createProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const categoryCollection = getCategoryCollection(context.db, args.category);

        if (!await categoryCollection.exists())
            throw makeApplicationError("CreateProduct_CategoryNotExists", GqlErrorCode.BadRequest);

        const newProduct = await categoryCollection.save({
            name: args.product.name,
            price: args.product.price
        }, { returnNew: true });

        return {
            id: newProduct.new!._id,
            name: newProduct.new!.name,
            price: newProduct.new!.price,
        };
    };