import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const updateProductMutation: GqlMutationResolvers<HollofabrikaContext>["updateProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const [collection, key] = args.id.split("/");

        const productToInsert = args.product satisfies DbProduct;

        const newProduct = await querySingle<Document<DbProduct>>(context.db, aql`
            update ${key} with ${productToInsert} in ${context.db.collection(collection)}
            options { ignoreErrors: true }
            return NEW
        `);

        if (!newProduct)
            throw makeApplicationError("UpdateProduct_ProductNotExists", GqlErrorCode.BadRequest);

        return {
            id: newProduct._id,
            name: newProduct.name,
            price: newProduct.price,
        };
    };