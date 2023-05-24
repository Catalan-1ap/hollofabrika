
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/**/*.graphql",
  generates: {
    "src/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        nonOptionalTypename: false,
        skipTypename: true
      }
    }
  }
};

export default config;