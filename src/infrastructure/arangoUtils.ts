import { Database } from "arangojs";
import { AqlQuery } from "arangojs/aql.js";
import { QueryOptions } from "arangojs/database.js";


export async function queryAll<T = any>(db: Database, query: AqlQuery, options?: QueryOptions) {
	const cursor = await db.query<T>(query, options);

	return {
		items: await cursor.all(),
		depletedCursor: cursor
	};
}

export async function querySingle<T = any>(db: Database, query: AqlQuery, options?: QueryOptions) {
	const { items, depletedCursor } = await queryAll<T>(db, query, options);

	return {
		item: items[0],
		depletedCursor: depletedCursor
	};
}