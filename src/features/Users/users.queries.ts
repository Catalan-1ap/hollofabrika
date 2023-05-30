import { aql } from "arangojs";
import { queryAll } from "../../infrastructure/dbUtils.js";
import { throwApplicationError } from "../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlQueryResolvers, GqlUser } from "../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../infrastructure/hollofabrikaContext.js";
import { getUsersCollection } from "./users.setup.js";


const usersResolver: GqlQueryResolvers<HollofabrikaContext>["users"] =
	async (_, args, context) => {
		if (!context.user)
			throwApplicationError("Unauthorized", GqlErrorCode.BadRequest);

		const usersCollection = getUsersCollection(context.db);

		const users = await queryAll<GqlUser>(context.db, aql`
			for doc in ${usersCollection}
			return {
				username: doc.username,
				email: doc.email,
				role: doc.role
			}
		`);

		return users;
	};


export default {
	Query: {
		users: usersResolver
	}
};