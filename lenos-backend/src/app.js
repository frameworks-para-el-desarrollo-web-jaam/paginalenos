import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import { CORS_ORIGINS, FRONTEND_URL } from "./config.js";

const allowedOrigins = [...new Set(["http://localhost:5173", FRONTEND_URL, ...CORS_ORIGINS])];
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-scripts.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" }));
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
  }),
);
app.use(helmet.hidePoweredBy());

app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "lenos-backend",
    message: "Backend desplegado correctamente en Vercel",
    endpoints: [
      "/api/health",
      "/api/comentarios",
      "/api/catalogo/productos",
      "/api/login",
      "/api/register",
    ],
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "lenos-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, _req, res, next) => {
  if (err?.message === "Origen no permitido por CORS") {
    return res.status(403).json({ message: err.message });
  }

  return next(err);
});

app.use("/api", comentariosRoutes);
app.use("/api", pedidosRoutes);
app.use("/api", authRoutes);
app.use("/api", productoRoutes);

export default app;
