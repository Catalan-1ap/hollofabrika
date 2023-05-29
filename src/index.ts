util.inspect.defaultOptions.depth = 7;

await import("dotenv").then(z => z.config());


import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import cors from "@koa/cors";
import Router from "@koa/router";
import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import util from "util";
import { formatErrorHandler } from "./infrastructure/formatErrorHandler.js";
import { contextHandler, HollofabrikaContext } from "./infrastructure/hollofabrikaContext.js";
import { reflectionSetup } from "./infrastructure/setups.js";


const { typeDefs, resolvers } = await reflectionSetup();

const app = new Koa();
const router = new Router();
const httpServer = http.createServer(app.callback());

const server = new ApolloServer<HollofabrikaContext>({
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	typeDefs: typeDefs,
	resolvers: resolvers,
	formatError: formatErrorHandler,

});
await server.start();

router.use(cors());
router.use(bodyParser());
router.all("/graphql", koaMiddleware<HollofabrikaContext>(server, {
	context: contextHandler
}));

app.use(router.routes());

httpServer.listen(process.env.SERVER_PORT);
console.log(`Server ready at http://localhost:${process.env.SERVER_PORT}`);
