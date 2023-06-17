import * as fs from "fs";
import path from "path";


export const defaultPageSize = 50;

export const productsCoversPath = path.join(path.resolve(), "public", "products", "covers");
if (!fs.existsSync(productsCoversPath)) {
    fs.mkdirSync(productsCoversPath, { recursive: true });
}