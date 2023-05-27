import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GqlJwtToken, GqlRole } from "../../infrastructure/gqlTypes.js";


type JwtPayload = {
	username: string,
	role: GqlRole
}

export function decodeToken(token: string): JwtPayload {
	return jwt.verify(token, process.env.JWT_SIGNATURE!) as JwtPayload;
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