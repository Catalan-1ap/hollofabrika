import { GqlErrorCode, GqlProduct, GqlQueryResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView } from "../../Categories/categories.setup.js";
import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const productQuery: GqlQueryResolvers<HollofabrikaContext>["product"] =
    async (_, args, context) => {
        const allProductsView = getAllProductsView(context.db);

        const { item } = await querySingle<GqlProduct>(context.db, aql`
            for doc in ${allProductsView}
            filter doc._id == ${args.id}
            return {
                id: doc._id,
                name: doc.name,
                description: doc.description,
                price: doc.price,
                attributes: doc.attributes
            }
        `);

        if (!item)
            throw makeApplicationError("Product_ProductNotExists", GqlErrorCode.BadRequest);

        return item;
    };