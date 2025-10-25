import { env } from "./env.js";

export const envKeys = {
    PORT: +(env.PORT ?? 8000),
    JWT_SECRET: env.JWT_SECRET,
    MONGO_URL: env.MONGO_URL,
    CLIENT_URL: env.CLIENT_URL,
};