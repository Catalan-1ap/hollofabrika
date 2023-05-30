import { JwtPayload } from "jsonwebtoken";
import { DbUser } from "../../infrastructure/dbTypes.js";
import { decodeToken } from "../Users/users.services.js";


export async function tryAuthorizeWithJwtBearer(token: string): Promise<JwtPayload | undefined> {
	try {
		return decodeToken(token)
	} catch (e) {
		return undefined;
	}
}