import "dotenv/config";
import app from "../src/app.js";
import { connectDB } from "../src/db.js";

let databaseReadyPromise;

const ensureDatabaseConnection = async () => {
  if (!databaseReadyPromise) {
    databaseReadyPromise = connectDB().catch((error) => {
      databaseReadyPromise = undefined;
      throw error;
    });
  }

  await databaseReadyPromise;
};

const isHealthRequest = (req) => {
  const pathParam = req.query?.path;
  const normalizedPath = Array.isArray(pathParam)
    ? pathParam.join("/")
    : pathParam || "";

  return req.url?.includes("/health") || normalizedPath.includes("health");
};

export default async function handler(req, res) {
  try {
    if (!isHealthRequest(req)) {
      await ensureDatabaseConnection();
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al iniciar el backend",
      error: error.message,
    });
  }
}
