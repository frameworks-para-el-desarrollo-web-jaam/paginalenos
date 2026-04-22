import path from "path";

export const PORT = Number(process.env.PORT || 3000);
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "CLAVESECRETA";
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/ventalenos";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const UPLOADS_DIR = process.env.VERCEL
  ? "/tmp/uploads"
  : path.resolve(process.cwd(), "uploads");
