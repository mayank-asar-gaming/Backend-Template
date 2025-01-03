import Redis, { Redis as RedisClient } from 'ioredis';
import { REDIS } from '../config';

let client: RedisClient | null = null;
let pubClient: RedisClient | null = null;
let subClient: RedisClient | null = null;
let isConnected = false;

export async function connect() {
    if (isConnected) {
        console.log("Redis already connected.");
        return client;
    }

    try {
        client = new Redis({
            port: REDIS.PORT,
            host: REDIS.HOST,
            password: REDIS.PASSWORD,
            maxRetriesPerRequest: null,
        });

        pubClient = client.duplicate();
        subClient = client.duplicate();

        client.on("connect", () => {
            console.log("Connected to Redis.");
            isConnected = true;
        });

        client.on("error", (error) => {
            console.error("Redis connection error:", error);
        });

        pubClient.on("error", (error) => console.error("Redis pubClient error:", error));
        subClient.on("error", (error) => console.error("Redis subClient error:", error));

        await client.ping(); // Ensure the connection is live
        return client;
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        throw error;
    }
}

export function getClient() {
    if (!isConnected || !client) {
        throw new Error("Redis client not initialized. Call `connect()` first.");
    }
    return client;
}

export function getPubClient() {
    return pubClient;
}

export function getSubClient() {
    return subClient;
}