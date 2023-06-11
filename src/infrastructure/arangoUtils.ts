import { Database } from "arangojs";
import { AqlQuery } from "arangojs/aql.js";
import { QueryOptions, TransactionCollections } from "arangojs/database.js";
import { Transaction } from "arangojs/transaction.js";


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

export async function transaction<T>(db: Database, collections: TransactionCollections, callback: (trx: Transaction) => Promise<T>) {
    const trx = await db.beginTransaction(collections, {
        allowImplicit: false
    });

    try {
        const result = await callback(trx);
        await trx.commit();

        return result;
    } catch (e) {
        await trx.abort();
        throw e;
    }
}