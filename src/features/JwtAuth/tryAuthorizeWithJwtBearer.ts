import { DbUser } from "../../infrastructure/dbTypes.js";


export async function tryAuthorizeWithJwtBearer(token: string): Promise<DbUser | undefined> {
	return undefined;
}