import { aql } from "arangojs";
import { DbRegisterTemporalToken, DbUser } from "../../../infrastructure/dbTypes.js";
import { querySingle } from "../../../infrastructure/dbUtils.js";
import { throwApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlMutationResolvers, GqlSuccessCode, GqlUser } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { mailSender } from "../../../infrastructure/mailSender.js";
import { generateNumberToken, hashPassword } from "../users.services.js";
import { getTemporalTokensCollection, getUsersCollection } from "../users.setup.js";


export const registerMutation: GqlMutationResolvers<HollofabrikaContext>["register"] =
	async (_, args, context) => {
		const usersCollection = getUsersCollection(context.db);
		const temporalTokensCollection = getTemporalTokensCollection(context.db);

		const existed = await querySingle<DbUser | DbRegisterTemporalToken>(context.db, aql`
			return not_null(
			    first(
			        for doc in ${usersCollection}
			        filter doc.username == ${args.username} or doc.email == ${args.email}
			        return doc
			    ),
			    first(
			        for doc in ${temporalTokensCollection}
			        filter doc.payload.username == ${args.username} or doc.payload.email == ${args.email}
			        return doc
			    )
			)
		`);

		if (existed) {
			const fieldsToCheck = [
				{ name: "username", message: "Register_UsernameInUseError" },
				{ name: "email", message: "Register_EmailInUseError" }
			] satisfies {
				name: keyof GqlUser,
				message: string
			}[];

			for (let field of fieldsToCheck) {
				const origin = "payload" in existed ? existed.payload[field.name] : existed[field.name];

				if (origin === args[field.name])
					throwApplicationError(field.message, GqlErrorCode.BadRequest);
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
			subject: "Email Confirmation",
			to: args.email,
			text: `
				Hello, ${args.username}!
				
				To verify your e-mail address, please use this key
				
				${registerTemporalToken.token}
			`
		});

		return {
			code: GqlSuccessCode.ConfirmAction
		};
	};