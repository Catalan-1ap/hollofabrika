import { GqlRole } from "./gqlTypes.js";


export type DbCategory = {
    name: string,
    collectionName: string,
    attributes: DbCategoryAttribute[]
}

export type DbCategoryAttribute = DbProductAttribute & {
    count: number
}

export type DbProduct = {
    name: string,
    coversFileNames: string[],
    description: string,
    price: number,
    attributes: DbProductAttribute[]
}

export type DbProductAttribute = {
    name: string,
    value: string
}

export type DbUser = {
    username: string,
    email: string,
    passwordHash: string,
    role: GqlRole
}

export type DbRefreshToken = {
    token: string,
    userId: string
}

export interface DbTemporalToken {
    type: "register" | "restore",
    emailToken: number,
    confirmToken: string
}

export interface DbRegisterTemporalToken extends DbTemporalToken {
    type: "register",
    payload: Omit<DbUser, "role">
}