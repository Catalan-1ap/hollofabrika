import { TransactionResultOptions } from "./arangoUtils.js";


export function mergeTransactionResultOptions(lhs: TransactionResultOptions, rhs: TransactionResultOptions) {
    lhs.catchers?.push(...rhs?.catchers ?? []);
    lhs.finalizers?.push(...rhs?.finalizers ?? []);
}