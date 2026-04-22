import { Router } from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";

import { sanitizeBody } from "../middlewares/sanitize.middleware.js";
import { validateRequest } from "../middlewares/express-validator.middleware.js";

const router = Router();
const comentarios = [];

const comentariosLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones desde esta IP",
    mensaje: "Solo puedes enviar 10 comentarios por minuto. Intenta nuevamente en un momento.",
  },
});

const normalizeComentarioPayload = (req, _res, next) => {
  if (typeof req.body?.texto === "string" && req.body.comentario === undefined) {
    req.body.comentario = req.body.texto;
  }

  if (typeof req.body?.comentario === "string" && req.body.texto === undefined) {
    req.body.texto = req.body.comentario;
  }

  next();
};

const comentarioValidators = [
  body("comentario")
    .exists({ checkFalsy: true })
    .withMessage("El texto del comentario es obligatorio")
    .bail()
    .isString()
    .withMessage("El texto del comentario debe ser texto plano")
    .bail()
    .isLength({ max: 200 })
    .withMessage("El texto no puede superar los 200 caracteres"),
  body("puntuacion")
    .exists({ checkFalsy: true })
    .withMessage("La puntuacion es obligatoria")
    .bail()
    .isInt()
    .withMessage("La puntuacion debe ser un entero")
    .toInt(),
];

router.post(
  "/comentarios",
  comentariosLimiter,
  sanitizeBody,
  normalizeComentarioPayload,
  comentarioValidators,
  validateRequest,
  (req, res) => {
    const nuevoComentario = {
      id: comentarios.length + 1,
      texto: req.body.comentario,
      puntuacion: req.body.puntuacion,
      createdAt: new Date().toISOString(),
    };

    comentarios.push(nuevoComentario);

    res.status(201).json({
      mensaje: "Comentario recibido correctamente",
      comentario: nuevoComentario,
    });
  },
);

router.get("/comentarios", (_req, res) => {
  res.json(comentarios);
});

export default router;
