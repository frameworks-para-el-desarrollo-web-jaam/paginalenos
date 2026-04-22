import mongoose from "mongoose";

const pedidoEstados = ["Pendiente", "En proceso", "Completado"];

const pedidoItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Producto",
            required: false,
        },
        nombreProducto: {
            type: String,
            required: true,
            trim: true,
        },
        precioUnitario: {
            type: Number,
            required: true,
            min: 0,
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1,
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        imagen: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const pedidoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    telefono: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 7,
        maxlength: 20,
    },
    direccion: {
        type: String, 
        required: true,
        trim: true,
    },
    fecha_solicitud: {
        type: Date,
        default : Date.now,
        required: false 
    },
    fecha_envio: {
        type: Date,
        required: false 
    },
    items: {
        type: [pedidoItemSchema],
        required: true,
        validate: {
            validator: (items) => Array.isArray(items) && items.length > 0,
            message: "El pedido debe incluir al menos un producto",
        },
    },
    cantidadProductos: {
        type: Number,
        required: true,
        min: 1,
    },
    total: { 
        type: Number,
        required: true,
        min: 0,
    },
    pagado: [String],
    estado: {
        type: String,
        default: "Pendiente",
        trim: true,
        enum: pedidoEstados,
    },

    comentario: { 
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true })

export default mongoose.model('Pedido', pedidoSchema)
