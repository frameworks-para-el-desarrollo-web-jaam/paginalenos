import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombreProducto: {
        type: String,
        required: true,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
        min: 0,
    },
    promocion: {
        type: Number,
        required: true,
        min: 0,
    },
    descripcion: {
        type: String,
        trim: true,
    },
    imagen: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Producto', productoSchema);