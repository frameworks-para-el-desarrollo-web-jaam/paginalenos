import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import {
    createProducto,
    deleteProducto,
    getCatalogoProductos,
    getProducto,
    getProductos,
    updateProducto,
} from "../controllers/productos.controller.js";
import { createProductoSchema, updateProductoSchema } from "../schemas/producto.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crear carpeta si no existe
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten imágenes'));
    }
    cb(null, true);
  }
});

const router = Router();

router.get("/catalogo/productos", getCatalogoProductos);

router.get("/productos", authRequire, getProductos);

router.post("/productos", authRequire, upload.single('imagen'), validateSchema(createProductoSchema), createProducto);

router.get("/productos/:id", authRequire, getProducto);

router.put("/productos/:id", authRequire, upload.single('imagen'), validateSchema(updateProductoSchema), updateProducto);

router.delete("/productos/:id", authRequire, deleteProducto);

export default router;
