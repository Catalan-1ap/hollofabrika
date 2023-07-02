import { Database } from "arangojs";
import { DbCategory, DbProduct } from "../../infrastructure/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getCategoriesCollection = (db: Database) =>
    db.collection<DbCategory>("categories");

export const getProductsCollection = (db: Database, name: string) =>
    db.collection<DbProduct>(`products-${name}`);

export const getAllProductsView = (db: Database) => db.view("allProductsView");


const setup: SetupHandler = async (db) => {
    const categoriesCollection = getCategoriesCollection(db);
    if (!await categoriesCollection.exists())
        await categoriesCollection.create();

    await allProductsViewSetup(db);
};

export default setup;


async function allProductsViewSetup(db: Database) {
    const allProductsView = getAllProductsView(db);
    if (!await allProductsView.exists())
        await allProductsView.create({
            type: "arangosearch"
        });
}