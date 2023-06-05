import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { DbProduct } from "../../../infrastructure/dbTypes.js";
import { Document } from "arangojs/documents.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const deleteProductMutation: GqlMutationResolvers<HollofabrikaContext>["deleteProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const [collection, key] = args.id.split("/");

        const { item: oldProduct } = await querySingle<Document<DbProduct>>(context.db, aql`
            remove ${key} in ${context.db.collection(collection)}
            options { ignoreErrors: true }
            return OLD
        `);

        if (!oldProduct)
            throw makeApplicationError("DeleteProduct_ProductNotExists", GqlErrorCode.BadRequest);

        return {
            id: oldProduct._id,
            name: oldProduct.name,
            price: oldProduct.price,
        };
    };