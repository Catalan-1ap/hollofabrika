import { GqlProduct, GqlQueryResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView, getCategoriesCollection } from "../../Categories/categories.setup.js";
import { queryAll } from "../../../infrastructure/arangoUtils.js";
import { aql } from "arangojs";
import { defaultPageSize } from "../../../infrastructure/constants.js";


export const productsQuery: GqlQueryResolvers<HollofabrikaContext>["products"] =
    async (_, args, context) => {
        const allProductsView = getAllProductsView(context.db);

        args.input ||= {};
        args.input.pageData ||= {
            page: 1,
            pageSize: defaultPageSize
        };

        const filterbByIds = args.input.ids?.length! > 0
            ? aql`filter product._id in ${args.input.ids}`
            : aql``;

        const categoriesCollection = getCategoriesCollection(context.db);
        const joinCategory = args.input.categories?.length! > 0
            ? aql`
                for category in ${categoriesCollection} 
                filter category.name in ${args.input.categories}
            `
            : aql`
                for category in ${categoriesCollection} 
            `;

        const { items, depletedCursor } = await queryAll<GqlProduct>(context.db, aql`
            ${joinCategory}
            for product in ${allProductsView}
            filter parse_identifier(product._id).collection == category.collectionName
            ${filterbByIds}
            limit ${args.input.pageData.pageSize * (args.input.pageData.page - 1)}, ${args.input.pageData.pageSize}
            return {
                id: product._id,
                category: category.name,
                name: product.name,
                description: product.description,
                price: product.price,
                attributes: product.attributes
            }
        `, { fullCount: true });

        return {
            pageData: {
                ...args.input.pageData,
                totalPages: depletedCursor.extra.stats?.fullCount! > args.input.pageData.pageSize
                    ? Math.ceil(depletedCursor.extra.stats?.fullCount! / args.input.pageData.pageSize)
                    : 1
            },
            items: items
        };
    };