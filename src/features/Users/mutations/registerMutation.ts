import { aql } from "arangojs";
import { DbUser } from "../../../infrastructure/dbTypes.js";
import { querySingle } from "../../../infrastructure/dbUtils.js";
import { GqlErrorCode, GqlMutationResolvers, GqlUser } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getUsersCollection } from "../users.setup.js";


export const registerMutation: GqlMutationResolvers<HollofabrikaContext>["register"] =
	async (_, args, context) => {
		const usersCollection = getUsersCollection(context.db);

		const existed = await querySingle<DbUser>(context.db, aql`
			return first(
			    for doc in ${usersCollection}
			    filter doc.username == ${args.username} or doc.email == ${args.email}
			    return doc
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
					}
			}
		}

		const hash = await hashPassword(body.password);
		const token = generateNumberToken();
		await prisma.registerTokens.upsert({
			create: {
				token: token,
				username: body.username,
				email: body.email,
				passwordHash: hash,
			},
			update: {
				token: token,
				username: body.username,
				email: body.email,
				passwordHash: hash,
			},
			where: {
				username: body.username
			}
		});
		await mailSender.sendMail({
			from: process.env.GMAIL_MAIL,
			subject: "Email Confirmation",
			to: body.email,
			text: `
Hello, ${body.username}!

To verify your e-mail address, please use this key

${token}
			`
		});
	};