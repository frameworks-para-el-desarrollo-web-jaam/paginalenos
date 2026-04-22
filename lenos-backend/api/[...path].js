import "dotenv/config";
import app from "../src/app.js";
import { connectDB } from "../src/db.js";

let databaseReadyPromise;

const ensureDatabaseConnection = async () => {
  if (!databaseReadyPromise) {
    databaseReadyPromise = connectDB();
  }

  await databaseReadyPromise;
};

export default async function handler(req, res) {
  try {
    if (req.url !== "/api/health") {
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
