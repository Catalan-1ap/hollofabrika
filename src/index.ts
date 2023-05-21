import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";


const schemaFilesPattern = "./src/schemas/*.graphql";
const schemaFiles = loadFilesSync(schemaFilesPattern);
const mergedSchema = mergeTypeDefs(schemaFiles);

const server = new ApolloServer({
	typeDefs: mergedSchema,
	resolvers: {
		Query: {
			books: () => [
				{
					title: "The Awakening",
				},
				{
					title: "City of Glass",
				},
			]
		}
	}
});

const { url } = await startStandaloneServer(server, {
	listen: {
		port: 3333
	}
});

console.log(`Server ready at ${url}`);
