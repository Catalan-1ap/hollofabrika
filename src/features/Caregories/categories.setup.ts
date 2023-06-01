import { Database } from "arangojs";
import { DbCategory, DbProduct } from "../../infrastructure/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getCategoryCollection = (db: Database, categoryName: string) =>
	db.collection<DbCategory | DbProduct>(`${categoryName}-products`);

const setup: SetupHandler = async (db) => {

};

export default setup;