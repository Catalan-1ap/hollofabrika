import { aql } from "arangojs";
import { HollofabrikaContext } from "../../infrastructure/hollofabrikaContext.js";
import { productsCoversWebPath } from "./productsConstants.js";


export function makeCoversUrls(context: HollofabrikaContext) {
    return aql`
        product.coversFileNames[* return
            concat_separator("/", 
                ${context.koaContext.origin}, 
                ${productsCoversWebPath}, 
                CURRENT || ${process.env.SERVER_STATIC_FALLBACK_FILENAME}
            )
        ]
    `;
}