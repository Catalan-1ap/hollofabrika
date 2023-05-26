import { loadFiles as toolsLoadFiles } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { arangojs, Database } from "arangojs";
import url from "url";


export type SetupHandler = (db: Database) => Promise<void> | void

export async function reflectionSetup() {
	const [typeDefs, resolvers] = await Promise.all([
		loadFilesSync("./src/features/**/*.schema.graphql").then(mergeTypeDefs),
		Promise.all([
			loadFilesSync("./src/features/**/*.queries.ts"),
			loadFilesSync("./src/features/**/*.mutations.ts")
		]).then(z => z.flat()).then(mergeResolvers),
		loadFilesSync("./src/features/**/*.setup.ts").then(setup)
	]) as [];

	return {
		typeDefs,
		resolvers
	};
}

export function connectToDb() {
	return arangojs({
		url: process.env.ARANGO_URL,
		databaseName: process.env.ARANGO_DB,
		auth: {
			username: process.env.ARANGO_USER,
			password: process.env.ARANGO_PASSWORD,
		}
	});
}

async function setup(setups: SetupHandler[]) {
	const db = connectToDb();

	await Promise.all(setups.map(z => z(db)));
}

function loadFilesSync(pattern: string) {
	return toolsLoadFiles(pattern, {
		requireMethod: async (path: string) => {
			return await import(url.pathToFileURL(path).toString());
		}
	});
}