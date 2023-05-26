import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3333/graphql",
  generates: {
    "src/infrastructure/gqlTypes.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        typesPrefix: "Gql",
        maybeValue: 'T | null | undefined',
        nonOptionalTypename: false,
        skipTypename: true
      }
    }
  }
};

export default config;