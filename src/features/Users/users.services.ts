import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GqlJwtToken, GqlRole } from "../../infrastructure/gqlTypes.js";


export type JwtPayload = {
	userId: string,
	role: GqlRole
}

export function decodeToken(token: string): JwtPayload | undefined {
	try {
		return jwt.verify(token, process.env.JWT_SIGNATURE!) as JwtPayload;
	} catch (e) {
		return undefined;
	}
}

export function generateTokens(payload: JwtPayload): GqlJwtToken {
	const access = jwt.sign(payload, process.env.JWT_SIGNATURE!, {
		expiresIn: process.env.JWT_ACCESS_EXPIRE!,
		jwtid: crypto.randomUUID().toString()
	});
	const refresh = jwt.sign(payload, process.env.JWT_SIGNATURE!, {
		expiresIn: process.env.JWT_REFRESH_EXPIRE!,
		jwtid: crypto.randomUUID().toString()
	});

	return { access, refresh };
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
	return await bcrypt.compare(password, hash);
}

export function generateNumberToken() {
	return Math.floor(Math.random() * 899999 + 100000);
}