import { GqlErrorCode, GqlMutationResolvers, GqlRole } from "../../../infrastructure/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/authGuards.js";
import { parseIdentifier, querySingle, transaction } from "../../../infrastructure/arangoUtils.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { Document } from "arangojs/documents.js";
import { DbCategory, DbProduct } from "../../../infrastructure/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { removeAttributes } from "./deleteProductMutation.js";
import { addAttributes } from "./createProductMutation.js";
import { queryCategory } from "../../Categories/categories.services.js";


export const changeCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["changeCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const identifier = parseIdentifier(args.id);
        const oldCategoryProducts = context.db.collection(identifier.collection);
        const product = await querySingle<Document<DbProduct>>(context.db, aql`
            for doc in ${oldCategoryProducts}
            filter doc._key == ${identifier.key}
            return doc
        `);
        if (!product)
            throw makeApplicationError("ChangeCategory_ProductNotExists", GqlErrorCode.BadRequest);

        const categoriesCollection = getCategoriesCollection(context.db);
        const { category: newCategory } = await queryCategory(context.db, args.category);
        if (!newCategory)
            throw makeApplicationError("ChangeCategory_NewCategoryNotExists", GqlErrorCode.BadRequest);

        const newCategoryProducts = context.db.collection(newCategory.collectionName);

        const oldCategory = await querySingle<Document<DbCategory>>(context.db, aql`
            for doc in ${categoriesCollection}
            filter doc.collectionName == ${identifier.collection}
            return doc
        `);

        if (newCategory.name === oldCategory.name)
            throw makeApplicationError("ChangeCategory_CategoriesAreSame", GqlErrorCode.BadRequest);

        return await transaction(context.db, {
            write: [oldCategoryProducts, newCategoryProducts],
            exclusive: [categoriesCollection]
        }, async trx => {
            removeAttributes(oldCategory, product.attributes);
            addAttributes(newCategory, product.attributes);

            await trx.step(() => querySingle<Document<DbProduct>>(context.db, aql`
                remove ${product} in ${oldCategoryProducts}
                options { ignoreErrors: true, ignoreRevs: false }
            `));
            const productToInsert: Required<DbProduct> = {
                name: product.name,
                price: product.price,
                description: product.description,
                attributes: product.attributes,
                coversFileNames: product.coversFileNames
            };
            const newProduct = await trx.step(() => querySingle<Document<DbProduct>>(context.db, aql`
                insert ${productToInsert} in ${newCategoryProducts}
                options { ignoreErrors: true }
                return NEW
            `));

            await trx.step(() => context.db.query(aql`
                update ${oldCategory}
                with ${oldCategory} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));
            await trx.step(() => context.db.query(aql`
                update ${newCategory}
                with ${newCategory} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: newProduct._id,
                    covers: newProduct.coversFileNames,
                    category: newCategory.name,
                    description: newProduct.description,
                    name: newProduct.name,
                    price: newProduct.price,
                    attributes: newProduct.attributes
                }
            };
        });
    };