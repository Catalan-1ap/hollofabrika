import { aql } from "arangojs";
import { HollofabrikaContext } from "../../infrastructure/hollofabrikaContext.js";
import { nanoid } from "nanoid";
import path from "path";
import { productsCoversPath } from "../../infrastructure/constants.js";
import fs from "fs";
import { catcherDeleteFile, finalizeWritableStream } from "../../infrastructure/filesUtils.js";
import { pipeline } from "stream/promises";
import { Scalars } from "../../infrastructure/gqlTypes.js";
import { TransactionResultOptions } from "../../infrastructure/arangoUtils.js";


export function makeCoversUrls(context: HollofabrikaContext) {
    return aql`
        product.coversFileNames[* return
            concat_separator("/", 
                ${context.koaContext.origin}, 
                ${process.env.SERVER_STATIC_ROOT_SEGMENT}, 
                ${process.env.SERVER_STATIC_COVERS_SEGMENT}, 
                CURRENT || ${process.env.SERVER_STATIC_FALLBACK_FILENAME}
            )
        ]
    `;
}

export async function saveProductCover(file: Scalars["Upload"]["file"], coverName?: string) {
    const coverFile = await file;

    coverName ??= `${nanoid()}${path.extname(coverFile?.filename ?? "somethingwentwrong")}`;
    const transactionResultOptions: TransactionResultOptions = {
        finalizers: [],
        catchers: []
    };

    const coverPath = path.join(productsCoversPath, coverName);
    const localCoverStream = fs.createWriteStream(coverPath);

    transactionResultOptions.finalizers?.push(finalizeWritableStream(localCoverStream));
    transactionResultOptions.catchers?.push(catcherDeleteFile(coverPath));

    await pipeline(coverFile.createReadStream(), localCoverStream);

    return {
        coverName: coverName,
        transactionResultOptions
    };
}