import { Database } from "arangojs";
import { AqlQuery } from "arangojs/aql.js";


export async function queryAll<T = any>(db: Database, query: AqlQuery) {
	const cursor = await db.query<T>(query);
	return await cursor.all();
}

export async function querySingle<T = any>(db: Database, query: AqlQuery) {
	const results = await queryAll<T>(db, query);
	return results[0];
}