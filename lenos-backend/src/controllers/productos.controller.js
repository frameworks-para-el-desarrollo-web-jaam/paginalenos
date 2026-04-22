import Producto from "../models/producto.model.js";

export const getCatalogoProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate('user');
        res.json(productos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProductos = async (req, res) => {
    const productos = await Producto.find({
        user: req.user.id
    }).populate('user');
    res.json(productos);
};

export const createProducto = async (req, res) => {
    try {
        const { nombreProducto, precio, promocion, descripcion } = req.body;
        const imagen = req.file ? `/uploads/${req.file.filename}` : null;

        const newProducto = new Producto({
            nombreProducto,
            precio,
            promocion,
            descripcion,
            imagen,
            user: req.user.id
        });
        const savedProducto = await newProducto.save();
        res.json(savedProducto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProducto = async (req, res) => {
    const producto = await Producto.findById(req.params.id).populate('user');
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    return res.json(producto);
};

export const deleteProducto = async (req, res) => {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    return res.sendStatus(204);
};

export const updateProducto = async (req, res) => {
    try {
        const productoActual = await Producto.findById(req.params.id);
        if (!productoActual) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productoActualizado = {
            ...req.body,
            imagen: req.file ? `/uploads/${req.file.filename}` : productoActual.imagen,
        };

        const producto = await Producto.findByIdAndUpdate(req.params.id, productoActualizado, {
            new: true,
        });

        res.json(producto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
