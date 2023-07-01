import { aql } from "arangojs";
import { DbRegisterTemporalToken, DbUser } from "../../../infrastructure/dbTypes.js";
import { querySingle } from "../../../infrastructure/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlUser } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { mailSender } from "../../../infrastructure/mailSender.js";
import { generateNumberToken, hashPassword } from "../users.services.js";
import { getTemporalTokensCollection, getUsersCollection } from "../users.setup.js";


export const registerMutation: GqlMutationResolvers<HollofabrikaContext>["register"] =
    async (_, args, context) => {
        const usersCollection = getUsersCollection(context.db);
        const temporalTokensCollection = getTemporalTokensCollection(context.db);

        const trx = await context.db.beginTransaction({
            read: [usersCollection],
            write: [temporalTokensCollection]
        });

        const existed = await trx.step(() => querySingle<DbUser>(context.db, aql`
			for doc in ${usersCollection}
			filter doc.username == ${args.username} or doc.email == ${args.email}
			return doc
		`));

        if (existed) {
            const fieldsToCheck = [
                { name: "username", message: "Register_UsernameInUseError" },
                { name: "email", message: "Register_EmailInUseError" }
            ] satisfies {
                name: keyof GqlUser,
                message: string
            }[];

            for (let field of fieldsToCheck) {
                const origin = existed[field.name];

                if (origin === args[field.name])
                    throw makeApplicationError(field.message, GqlErrorCode.BadRequest);
            }
        }

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
				
				${registerTemporalToken.emailToken}
			`
        });

        await trx.commit();
        return {
            confirmToken: registerTemporalToken.confirmToken
        };
    };