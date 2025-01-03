import dotEnv from "dotenv";
dotEnv.config();

export const MONGO_URI: string | undefined = process.env.MONGO_URI || "";

export const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

export const PORT: string | undefined = process.env.PORT;

export const REDIS = {
    USERNAME: process.env.REDIS_USERNAME as string | "",
    HOST: process.env.REDIS_HOST as string | "localhost",
    PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    PASSWORD: process.env.REDIS_PASSWORD as string | "",
};

export const BUNNYCDN = {
    HOST: process.env.BUNNYCDN_HOSTNAME as string | undefined,
    ZONE: process.env.STORAGE_ZONE_NAME as string | undefined,
    KEY: process.env.BUNNYCDN_API_KEY as string | undefined,
}

export const SMS = {
    SID: process.env.SMS_SID_KEY as string | undefined,
    AUTH: process.env.SMS_API_AUTH_KEY as string | undefined,
    API: process.env.SMS_API as string | undefined,
}

export const CASHFREE = {
    CLIENT: process.env.CASHFREE_CLIENT_ID_KEY as string | undefined,
    SECRET: process.env.CASHFREE_SECRET_KEY as string | undefined,
    UPI: process.env.CASHFREE_UPI as string | undefined,
}

export const PAYMENT_GATEWAY = {
    APP: process.env.YOUR_APP_ID as string | undefined,
    SECRET: process.env.YOUR_SECRET_KEY as string | undefined,
    LINK: process.env.YOUR_PAYMENT_LINK as string | undefined,
}