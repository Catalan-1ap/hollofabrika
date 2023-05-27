import { Database } from "arangojs";
import { DbTemporalToken, DbUser } from "../../infrastructure/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getUsersCollection = (db: Database) => db.collection<DbUser>("users");
export const getTemporalTokensCollection = (db: Database) => db.collection<DbTemporalToken>("temporalTokens");

const setup: SetupHandler = async (db) => {
	const usersCollection = getUsersCollection(db);
	const temporalTokensCollection = getTemporalTokensCollection(db);

	if (!await usersCollection.exists())
		await usersCollection.create();

	if (!await temporalTokensCollection.exists()) {
		await temporalTokensCollection.create({
			computedValues: [
				{
					name: "createdAt",
					computeOn: ["insert"],
					overwrite: true,
					expression: "RETURN DATE_NOW() / 1000"
				}
			]
		});
		await temporalTokensCollection.ensureIndex({
			type: "ttl",
			fields: ["createdAt"],
			expireAfter: 300
		});
	}
};

export default setup;