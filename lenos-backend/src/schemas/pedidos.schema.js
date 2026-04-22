import { z } from "zod";

const pedidoStatusValues = ["Pendiente", "En proceso", "Completado"];

const pedidoItemSchema = z.object({
  productId: z.string().optional(),
  nombreProducto: z.string({
    required_error: "El nombre del producto es requerido",
  }).min(1, "El nombre del producto es requerido"),
  precioUnitario: z.coerce.number({
    required_error: "El precio unitario es requerido",
    invalid_type_error: "El precio unitario debe ser valido",
  }).min(0, "El precio unitario no puede ser negativo"),
  cantidad: z.coerce.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad debe ser valida",
  }).int("La cantidad debe ser entera").min(1, "La cantidad debe ser al menos 1"),
  imagen: z.string().optional(),
});

export const createPedidoSchema = z.object({
  nombre: z.string({
    required_error: "El nombre es requerido",
  }).min(1, "El nombre es requerido"),
  telefono: z.string({
    required_error: "El telefono es requerido",
  }).min(7, "El telefono debe tener al menos 7 digitos"),
  direccion: z.string({
    required_error: "La direccion es requerida",
  }).min(5, "La direccion es requerida"),
  comentario: z.string().optional(),
  items: z.array(pedidoItemSchema).min(1, "Debes agregar al menos un producto"),
});

export const updatePedidoSchema = z.object({
  estado: z.enum(pedidoStatusValues, {
    errorMap: () => ({ message: "El estado del pedido no es valido" }),
  }),
});
