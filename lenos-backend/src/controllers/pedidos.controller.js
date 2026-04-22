import Pedido from "../models/pedido.model.js";

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate("user")
      .sort({ createdAt: -1 });

    res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPedido = async (req, res) => {
  try {
    const { nombre, telefono, direccion, comentario, items } = req.body;

    const itemsNormalizados = items.map((item) => {
      const precioUnitario = Number(item.precioUnitario);
      const cantidad = Number(item.cantidad);

      return {
        productId: item.productId || undefined,
        nombreProducto: item.nombreProducto,
        precioUnitario,
        cantidad,
        subtotal: Number((precioUnitario * cantidad).toFixed(2)),
        imagen: item.imagen || "",
      };
    });

    const cantidadProductos = itemsNormalizados.reduce(
      (total, item) => total + item.cantidad,
      0
    );

    const total = Number(
      itemsNormalizados.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)
    );
    
    const newPedido = new Pedido({
      nombre,
      telefono,
      direccion,
      items: itemsNormalizados,
      cantidadProductos,
      total,
      comentario,
      user: req.user?.id,
    });
    const savedPedido = await newPedido.save();
    res.status(201).json(savedPedido);
  
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPedido = async (req, res) => {
  const pedido = await Pedido.findById(req.params.id).populate('user');
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    return res.json(pedido);
};


export const deletePedido = async (req, res) => {
 const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    return res.sendStatus(204);
};

export const updatePedido = async (req, res) => {
  try {
    const updateData = {
      estado: req.body.estado,
    };

    if (req.body.estado === "Completado") {
      updateData.fecha_envio = new Date();
    } else {
      updateData.fecha_envio = null;
    }

    const pedido = await Pedido.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


