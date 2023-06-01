import { GraphQLError, GraphQLFormattedError } from "graphql/index.js";
import { GqlErrorCode } from "./gqlTypes.js";


export function makeApplicationError(message: string, code: GqlErrorCode) {
	return new GraphQLError(message, {
		extensions: {
			type: "ApplicationError",
			code: code
		}
	});
}

export const formatErrorHandler: (
	formattedError: GraphQLFormattedError,
	error: unknown,
) => GraphQLFormattedError = (formattedError, error) => {
	if (error instanceof GraphQLError && error.extensions.type === "ApplicationError") {
		return {
			message: error.message,
			code: error.extensions.code
		};
	}

	console.error("Unhandled, undocumented error occured", error);

	return {
		message: "UndocumentedError",
		code: GqlErrorCode.InternalError
	};
};