import { GqlProduct, GqlQueryResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView } from "../../Categories/categories.setup.js";
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

        const filterbByIds = args.input.ids?.length! > 0 ? aql`filter doc._id in ${args.input.ids}` : aql``;
        const { items, depletedCursor } = await queryAll<GqlProduct>(context.db, aql`
            for doc in ${allProductsView}
            ${filterbByIds}
            limit ${args.input.pageData.pageSize * (args.input.pageData.page - 1)}, ${args.input.pageData.pageSize}
            return {
                id: doc._id,
                name: doc.name,
                description: doc.description,
                price: doc.price,
                attributes: doc.attributes
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