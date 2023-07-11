import { aql } from "arangojs";
import { HollofabrikaContext } from "../../infrastructure/hollofabrikaContext.js";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
import { catcherDeleteFile, finalizeWritableStream } from "../../infrastructure/filesUtils.js";
import { pipeline } from "stream/promises";
import { Scalars } from "../../infrastructure/gqlTypes.js";
import { TransactionRecovery } from "../../infrastructure/transactionRecovery.js";
import { productsCoversPath, productsCoversWebPath } from "./productsConstants.js";


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


export async function saveProductCover(file: Scalars["Upload"]["file"], coverName?: string) {
    const coverFile = await file;

    coverName ??= `${nanoid()}${path.extname(coverFile?.filename ?? "somethingwentwrong")}`;
    const transactionRecovery = new TransactionRecovery();

    const coverPath = path.join(productsCoversPath, coverName);
    const localCoverStream = fs.createWriteStream(coverPath);

    transactionRecovery.merge(new TransactionRecovery({
        finalizers: [finalizeWritableStream(localCoverStream)],
        catchers: [catcherDeleteFile(coverPath)]
    }));

    await pipeline(coverFile.createReadStream(), localCoverStream);

    return {
        coverName: coverName,
        transactionRecovery
    };
}