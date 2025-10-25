export {}; // Ensures this file is treated as a module, avoiding global namespace pollution.

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}