import { aql } from "arangojs";
import { DbRegisterTemporalToken } from "../../../infrastructure/dbTypes.js";
import { querySingle } from "../../../infrastructure/dbUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlRole, GqlSuccessCode } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getTemporalTokensCollection, getUsersCollection } from "../users.setup.js";


export const verifyEmailMutation: GqlMutationResolvers<HollofabrikaContext>["verifyEmail"] =
	async (_, args, context) => {
		const temporalTokensCollection = getTemporalTokensCollection(context.db);

		const registerToken = await querySingle<DbRegisterTemporalToken>(context.db, aql`
			for doc in ${temporalTokensCollection}
			filter doc.type == "register" and doc.emailToken == ${args.emailToken} and doc.confirmToken == ${args.confirmToken}
			remove doc in ${temporalTokensCollection}
			return OLD
		`);
		if (!registerToken)
			throw makeApplicationError("VerifyEmail_WrongToken", GqlErrorCode.BadRequest);

		const usersCollection = getUsersCollection(context.db);

		await usersCollection.save({
			...registerToken.payload,
			role: GqlRole.Standalone
		});

		return {
			code: GqlSuccessCode.Oke
		};
	};