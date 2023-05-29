import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/dbUtils.js";
import { throwApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { decodeToken, generateTokens } from "../users.services.js";
import { getRefreshTokensCollection } from "../users.setup.js";


export const refreshMutation: GqlMutationResolvers<HollofabrikaContext>["refresh"] =
	async (_, args, context) => {
		const payload = decodeToken(args.token);

		if (!payload)
			throwApplicationError("Refresh_WrongTokenError", GqlErrorCode.BadRequest);

		const refreshTokensCollection = getRefreshTokensCollection(context.db);

		const isTokenDeleted = await querySingle<boolean>(context.db, aql`
			for doc in ${refreshTokensCollection}
			filter doc.token == ${args.token}
			remove doc in ${refreshTokensCollection}
			return true
		`);
		if (!isTokenDeleted)
			throwApplicationError("Refresh_UsedTokenError", GqlErrorCode.BadRequest);

		const tokens = generateTokens({
			userId: payload.userId,
			role: payload.role
		});

		await refreshTokensCollection.save({
			token: tokens.refresh,
			userId: payload.userId
		});

		return {
			access: tokens.access,
			refresh: tokens.refresh
		};
	};