util.inspect.defaultOptions.depth = 7;

await import("dotenv").then(z => z.config());
await import("envalid").then(z => z.cleanEnv(process.env, {
    NODE_ENV: z.str({ choices: [ "development", "production" ] }),

    SERVER_PORT: z.num(),

    ARANGO_URL: z.url(),
    ARANGO_DB: z.str(),
    ARANGO_USER: z.str(),
    ARANGO_PASSWORD: z.str(),

    REDIS_DEFAULT_CACHE_TTL: z.num(),
    REDIS_PORT: z.num(),

    JWT_SIGNATURE: z.str(),
    JWT_ACCESS_EXPIRE: z.str(),
    JWT_REFRESH_EXPIRE: z.str(),

    GMAIL_MAIL: z.email(),
}));


import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import cors from "@koa/cors";
import Router from "@koa/router";
import { resolvers as scalarResolvers, typeDefs as scalarsTypeDefs } from "graphql-scalars";
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
	typeDefs: [...scalarsTypeDefs, typeDefs],
	resolvers: [scalarResolvers, resolvers],
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
