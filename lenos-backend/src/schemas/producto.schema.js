import { z } from "zod";

const numberField = (label) =>
  z.coerce.number({
    required_error: `${label} es requerido`,
    invalid_type_error: `${label} debe ser un numero valido`,
  }).min(0, {
    message: `${label} debe ser un numero mayor o igual a 0`,
  });

export const createProductoSchema = z.object({
  nombreProducto: z.string({
    required_error: "Nombre del producto es requerido",
  }),
  precio: numberField("Precio"),
  promocion: numberField("Promocion"),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
});

export const updateProductoSchema = z.object({
  nombreProducto: z.string().optional(),
  precio: numberField("Precio").optional(),
  promocion: numberField("Promocion").optional(),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
});
