import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  JWT_SECRET: z.string().nonempty("JWT_SECRET is required"),
  MONGO_URL: z.string().nonempty("MONGO_URL is required"),
  CLIENT_URL: z.string().nonempty("CLIENT_URL is required"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  OPTION: z.string(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);
  if (!validationResult.success)
    throw new Error(validationResult.error.message);
  return validationResult.data;
}

export const env = createEnv(process.env);
