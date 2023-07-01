import { aql } from "arangojs";
import { Document } from "arangojs/documents.js";
import { DbUser } from "../../../infrastructure/dbTypes.js";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { comparePassword, generateTokens } from "../users.services.js";
import { getRefreshTokensCollection, getUsersCollection } from "../users.setup.js";


export const loginMutation: GqlMutationResolvers<HollofabrikaContext>["login"] =
    async (_, args, context) => {
        const usersCollection = getUsersCollection(context.db);

        const user = await querySingle<Document<DbUser>>(context.db, aql`
			for doc in ${usersCollection}
			filter doc.username == ${args.username} or doc.email == ${args.username}
			return doc
		`);
        if (!user)
            throw makeApplicationError("Login_WrongUsernameError", GqlErrorCode.BadRequest);

        const isPasswordCorrect = await comparePassword(args.password, user.passwordHash);
        if (!isPasswordCorrect)
            throw makeApplicationError("Login_WrongPasswordError", GqlErrorCode.BadRequest);

        const tokens = generateTokens({
            userId: user._id,
            role: user.role
        });

        const refreshTokensCollection = await getRefreshTokensCollection(context.db);
        await refreshTokensCollection.save({
            token: tokens.refresh,
            userId: user._id
        });

        return {
            access: tokens.access,
            refresh: tokens.refresh
        };
    };