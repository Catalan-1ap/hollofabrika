import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategory } from "../../Categories/categories.services.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { transaction, TransactionResultOptions } from "../../../infrastructure/arangoUtils.js";
import { nanoid } from "nanoid";
import path from "path";
import { productsCoversPath } from "../../../infrastructure/constants.js";
import * as fs from "fs";
import { pipeline } from "stream/promises";
import { catcherDeleteFile, finalizeWritableStream } from "../../../infrastructure/filesUtils.js";


export const createProductMutation: GqlMutationResolvers<HollofabrikaContext>["createProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            category,
            categoriesCollection,
            isCategoryExists
        } = await getCategory(context.db, args.category);
        if (!isCategoryExists)
            throw makeApplicationError("CreateProduct_CategoryNotExists", GqlErrorCode.BadRequest);

        const productToInsert: DbProduct = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes
        };

        addAttributes(category, productToInsert);

        const productsCollection = context.db.collection<DbProduct>(category.collectionName);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const transactionResultOptions: TransactionResultOptions = {
                finalizers: [],
                catchers: []
            };

            if (args.product.cover) {
                const coverFile = await args.product.cover.file;
                productToInsert.coverName = `${nanoid()}${path.extname(coverFile?.filename ?? "somethingwentwrong")}`;

                const coverPath = path.join(productsCoversPath, productToInsert.coverName);
                const localCoverStream = fs.createWriteStream(coverPath);

                transactionResultOptions.finalizers?.push(finalizeWritableStream(localCoverStream));
                transactionResultOptions.catchers?.push(catcherDeleteFile(coverPath));

                await pipeline(coverFile.createReadStream(), localCoverStream);
            }

            const newProduct = await trx.step(() =>
                productsCollection.save(productToInsert, { returnNew: true })
            );

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: newProduct.new!._id,
                    cover: newProduct.new?.coverName,
                    category: category.name,
                    description: newProduct.new!.description,
                    name: newProduct.new!.name,
                    price: newProduct.new!.price,
                    attributes: newProduct.new!.attributes
                },
                ...transactionResultOptions
            };
        });
    };

export function addAttributes(category: DbCategory, product: DbProduct) {
    for (let attribute of product.attributes) {
        const categoryAttribute = category.attributes
            .find(x => x.name === attribute.name && x.value === attribute.value);

        if (categoryAttribute) {
            categoryAttribute.count++;
            continue;
        }

        category.attributes.push({
            ...attribute,
            count: 1
        });
    }
}