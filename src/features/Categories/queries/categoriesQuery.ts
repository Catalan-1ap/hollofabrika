import { GqlCategory, GqlQueryResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getCategoriesCollection } from "../categories.setup.js";
import { queryAll } from "../../../infrastructure/arangoUtils.js";
import { aql } from "arangojs";


export const categoriesQuery: GqlQueryResolvers<HollofabrikaContext>["categories"] =
    async (_, args, context) => {
        const categoriesCollection = getCategoriesCollection(context.db);

        const { items } = await queryAll<GqlCategory>(context.db, aql`
            for doc in ${categoriesCollection}
            return {
                name: doc.name,
                attributes: doc.attributes
            }
        `);

        return items;
    };