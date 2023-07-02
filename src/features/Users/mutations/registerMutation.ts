import { aql } from "arangojs";
import { DbRegisterTemporalToken, DbUser } from "../../../infrastructure/dbTypes.js";
import { querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import {
    GqlErrorCode,
    GqlMutationRegisterArgs,
    GqlMutationResolvers,
    GqlUser
} from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { mailSender } from "../../../infrastructure/mailSender.js";
import { generateNumberToken, hashPassword } from "../users.services.js";
import { getTemporalTokensCollection, getUsersCollection } from "../users.setup.js";
import * as crypto from "crypto";


export const registerMutation: GqlMutationResolvers<HollofabrikaContext>["register"] =
    async (_, args, context) => {
        const usersCollection = getUsersCollection(context.db);
        const temporalTokensCollection = getTemporalTokensCollection(context.db);

        const existedUser = await querySingle<DbUser>(context.db, aql`
			for doc in ${usersCollection}
			filter doc.username == ${args.username} or doc.email == ${args.email}
			return doc
		`);

        if (existedUser)
            throwIfFieldsAreDuplicated(existedUser, args);

        const hash = await hashPassword(args.password);

        const registerTemporalToken: DbRegisterTemporalToken = {
            type: "register",
            emailToken: process.env.NODE_ENV === "development" ? 111111 : generateNumberToken(),
            confirmToken: crypto.randomUUID(),
            payload: {
                username: args.username,
                email: args.email,
                passwordHash: hash
            },
        };

        return await transaction(context.db, {
            write: [temporalTokensCollection]
        }, async trx => {
            await trx.step(() => context.db.query(aql`
		    	upsert ${{ payload: { username: args.username, email: args.email } }}
		    	insert ${registerTemporalToken}
		    	update ${registerTemporalToken} IN ${temporalTokensCollection}
		    `));

            await mailSender.sendMail({
                subject: "Email Confirmation",
                to: args.email,
                text: `
				Hello, ${args.username}!
				
				To verify your e-mail address, please use this key
				
				${registerTemporalToken.emailToken}`
            });

            return {
                data: {
                    confirmToken: registerTemporalToken.confirmToken
                }
            };
        });
    };


function throwIfFieldsAreDuplicated(user: DbUser, args: GqlMutationRegisterArgs) {
    const fieldsToCheck = [
        { name: "username", message: "Register_UsernameInUseError" },
        { name: "email", message: "Register_EmailInUseError" }
    ] satisfies {
        name: keyof GqlUser,
        message: string
    }[];

    for (let field of fieldsToCheck) {
        const origin = user[field.name];

        if (origin === args[field.name])
            throw makeApplicationError(field.message, GqlErrorCode.BadRequest);
    }
}