import { GqlErrorCode, GqlProduct, GqlQueryResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView, getCategoriesCollection } from "../../Categories/categories.setup.js";
import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const productQuery: GqlQueryResolvers<HollofabrikaContext>["product"] =
    async (_, args, context) => {
        const allProductsView = getAllProductsView(context.db);

        const categoriesCollection = getCategoriesCollection(context.db);
        const { item } = await querySingle<GqlProduct>(context.db, aql`
            for category in ${categoriesCollection} 
            for product in ${allProductsView}
            filter product._id == ${args.id}
            return {
                id: product._id,
                category: category.name,
                name: product.name,
                description: product.description,
                price: product.price,
                attributes: product.attributes
            }
        `);

        if (!item)
            throw makeApplicationError("Product_ProductNotExists", GqlErrorCode.BadRequest);

        return item;
    };