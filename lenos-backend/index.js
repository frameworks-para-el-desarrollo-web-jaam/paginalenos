import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/db.js";

let databaseReadyPromise;

const ensureDatabaseConnection = async () => {
  if (!databaseReadyPromise) {
    databaseReadyPromise = connectDB();
  }

  await databaseReadyPromise;
};

export default async function handler(req, res) {
  await ensureDatabaseConnection();
  return app(req, res);
}
