import { Database } from "arangojs";
import { AqlQuery } from "arangojs/aql.js";
import { QueryOptions, TransactionCollections } from "arangojs/database.js";
import { Transaction } from "arangojs/transaction.js";
import { TransactionRecovery } from "./transactionRecovery.js";


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


type TransactionResult<T> = {
    data: T,
} & { recoveryActions?: TransactionRecovery }


export async function transaction<T>(
    db: Database,
    collections: TransactionCollections,
    callback: (trx: Transaction) => Promise<TransactionResult<T>>
) {
    const trx = await db.beginTransaction(collections, {
        allowImplicit: false
    });

    let result: TransactionResult<T> | undefined;

    try {
        result = await callback(trx);
        await trx.commit();

        return result.data;
    } catch (e) {
        await trx.abort();
        for (let catcher of result?.recoveryActions?.catchers || []) {
            await catcher();
        }
        throw e;
    } finally {
        for (let finalizer of result?.recoveryActions?.finalizers || []) {
            await finalizer();
        }
    }
}