import { createProductMutation } from "./mutations/createProductMutation.js";
import { deleteProductMutation } from "./mutations/deleteProductMutation.js";
import { updateProductMutation } from "./mutations/updateProductMutation.js";


export default {
    Mutation: {
        createProduct: createProductMutation,
        deleteProduct: deleteProductMutation,
        updateProduct: updateProductMutation
    }
};