import { Database } from "arangojs";
import { DbRefreshToken, DbTemporalToken, DbUser } from "../../infrastructure/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getUsersCollection = (db: Database) => db.collection<DbUser>("users");
export const getTemporalTokensCollection = (db: Database) => db.collection<DbTemporalToken>("temporalTokens");
export const getRefreshTokensCollection = (db: Database) => db.collection<DbRefreshToken>("refreshTokens");


const setup: SetupHandler = async (db) => {
    await usersCollectionSetup(db);
    await temporalTokensCollectionSetup(db);
    await refreshTokensCollectionSetup(db);
};

export default setup;


async function usersCollectionSetup(db: Database) {
    const usersCollection = getUsersCollection(db);

    if (!await usersCollection.exists())
        await usersCollection.create();
}


async function temporalTokensCollectionSetup(db: Database) {
    const temporalTokensCollection = getTemporalTokensCollection(db);

    if (!await temporalTokensCollection.exists())
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

    if (process.env.NODE_ENV === "production") {
        await temporalTokensCollection.ensureIndex({
            type: "ttl",
            fields: ["createdAt"],
            expireAfter: 300
        });
    }
}


async function refreshTokensCollectionSetup(db: Database) {
    const refreshTokensCollection = getRefreshTokensCollection(db);

    if (!await refreshTokensCollection.exists())
        await refreshTokensCollection.create();

    await refreshTokensCollection.ensureIndex({
        type: "ttl",
        fields: ["expireAt"],
        expireAfter: 0
    });
}