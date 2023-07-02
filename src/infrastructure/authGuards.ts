import { JwtPayload } from "../features/Users/users.services.js";
import { makeApplicationError } from "./formatErrorHandler.js";
import { GqlErrorCode, GqlRole } from "./gqlTypes.js";
import { HollofabrikaContext } from "./hollofabrikaContext.js";


export function anonymousGuard(context: HollofabrikaContext): asserts context is HollofabrikaContext & {
	user: JwtPayload
} {
	if (!context.user)
		throw makeApplicationError("Unauthorized", GqlErrorCode.BadRequest);
}


export function roleGuard(context: HollofabrikaContext, role: GqlRole): asserts context is HollofabrikaContext & {
	user: JwtPayload
} {
	if (!context.user || context?.user?.role !== role)
		throw makeApplicationError("Forbidden", GqlErrorCode.BadRequest);
}