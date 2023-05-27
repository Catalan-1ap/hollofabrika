import { GqlQueryResolvers } from "../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../infrastructure/hollofabrikaContext.js";


const usersResolver: GqlQueryResolvers<HollofabrikaContext>["users"] =
	async (_, args, context) => {
		return [
			{
				username: "2",
				email: "1"
			}
		];
	};


export default {
	Query: {
		users: usersResolver
	}
};