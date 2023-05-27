import { aql } from "arangojs";
import { DbRegisterTemporalToken, DbUser } from "../../../infrastructure/dbTypes.js";
import { querySingle } from "../../../infrastructure/dbUtils.js";
import { GqlErrorCode, GqlMutationResolvers, GqlUser } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { mailSender } from "../../../infrastructure/mailSender.js";
import { generateNumberToken, hashPassword } from "../users.services.js";
import { getTemporalTokensCollection, getUsersCollection } from "../users.setup.js";


export const registerMutation: GqlMutationResolvers<HollofabrikaContext>["register"] =
	async (_, args, context) => {
		const usersCollection = getUsersCollection(context.db);
		const temporalTokensCollection = getTemporalTokensCollection(context.db);

		const existed = await querySingle<DbUser>(context.db, aql`
			return not_null(
			    first(
			        for doc in ${usersCollection}
			        filter doc.username == ${args.username} or doc.email == ${args.email}
			        return doc
			    ),
			    first(
			        for doc in ${temporalTokensCollection}
			        filter doc.username == ${args.username} or doc.email == ${args.email}
			        return doc
			    )
			)
		`);

		if (existed) {
			const fieldsToCheck: {
				name: keyof GqlUser,
				message: string
			}[] = [
				{ name: "username", message: "Register_UsernameInUseError" },
				{ name: "email", message: "Register_EmailInUseError" }
			];

			for (let field of fieldsToCheck) {
				const origin = existed[field.name];

				if (origin === args[field.name])
					return {
						code: GqlErrorCode.BadRequest,
						message: field.message
					};
			}
		}

		const hash = await hashPassword(args.password);

		const registerTemporalToken: DbRegisterTemporalToken = {
			type: "register",
			token: generateNumberToken(),
			payload: {
				username: args.username,
				email: args.email,
				passwordHash: hash
			},
		};
		await temporalTokensCollection.save(registerTemporalToken);

		await mailSender.sendMail({
			from: process.env.GMAIL_MAIL,
			subject: "Email Confirmation",
			to: args.email,
			text: `
				Hello, ${args.username}!
				
				To verify your e-mail address, please use this key
				
				${registerTemporalToken.token}
			`
		});
	};