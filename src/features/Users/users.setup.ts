import { Database } from "arangojs";
import { DbUser } from "../../infrastructure/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getUsersCollection = (db: Database) => db.collection<DbUser>("users");

const setup: SetupHandler = async (db) => {
	const usersCollection = getUsersCollection(db);

	if (!await usersCollection.exists())
		await usersCollection.create();
};

export default setup;