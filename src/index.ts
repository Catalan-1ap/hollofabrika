import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import { loadFiles as toolsLoadFiles } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import cors from "@koa/cors";
import Router from "@koa/router";
import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import * as url from "url";

function loadFilesSync(pattern: string) {
	return toolsLoadFiles(pattern, {
		requireMethod: async (path: string) => {
			return await import(url.pathToFileURL(path).toString());
		}
	})
}

const schemaFiles = await loadFilesSync("./src/features/**/*.schema.graphql");
const typeDefs = mergeTypeDefs(schemaFiles);

const queriesFiles = await loadFilesSync("./src/features/**/*.queries.ts");
const mutationsFiles = await loadFilesSync("./src/features/**/*.mutations.ts");
const resolvers = mergeResolvers([...queriesFiles, ...mutationsFiles])

const app = new Koa();
const router = new Router();
const httpServer = http.createServer(app.callback());

const server = new ApolloServer({
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	typeDefs: typeDefs,
	resolvers: resolvers
});
await server.start();

router.use(cors());
router.use(bodyParser());
router.post("/graphql", koaMiddleware(server, {
	context: async ({ ctx }) => ({ token: ctx.headers.token }),
}));

app.use(router.routes());
app.use(router.allowedMethods());

const port = 3333;
httpServer.listen(port)
console.log(`Server ready at http://localhost:${port}`);
