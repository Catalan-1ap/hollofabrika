import { Redis } from "ioredis";


const redisCache = new Redis(Number(process.env.REDIS_PORT));

export async function setCache(key: string, value: object) {
    return redisCache.set(
        key,
        JSON.stringify(value),
        "EX",
        Number(process.env.REDIS_DEFAULT_CACHE_TTL)
    );
}

export async function getCache(key: string) {
    return redisCache.get(key);
}

export async function evictCache(keys: string[]) {
    return redisCache.del(keys);
}