const Pedido = require("../models/Pedido");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const Tienda = require("../models/Tienda");

exports.crearPedidoPublico = async (req, res, next) => {
  try {
    const { usuarioId, productos } = req.body;
    const tienda = await Tienda.findOne({ slug: req.params.slug });
    if (!tienda) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }

    let total = 0;

    const usuarioExiste = await Usuario.findById(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    for (const item of productos) {
      const prod = await Producto.findById(item.productoId);
      if (!prod) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      if (prod.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para: ${prod.nombre}` });
      }
      prod.stock -= item.cantidad;
      await prod.save();
      total += prod.precio * item.cantidad;
    }

    const ultimoPedido = await Pedido.findOne().sort({ numeroOrden: -1 });
    const numeroOrden =
      ultimoPedido && ultimoPedido.numeroOrden ? ultimoPedido.numeroOrden + 1 : 1;

    const nuevoPedido = new Pedido({
      numeroOrden,
      usuarioId,
      tiendaId: tienda._id,
      productos,
      total,
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    next(error);
  }
};

exports.crearPedido = async (req, res, next) => {
  try {
    const { usuarioId, tiendaId, fecha, productos, estado } = req.body;

    let total = 0;

    const usuarioExiste = await Usuario.findById(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    for (const item of productos) {
      const prod = await Producto.findById(item.productoId);
      if (!prod) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      if (prod.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para: ${prod.nombre}` });
      }
      prod.stock -= item.cantidad;
      await prod.save();
      total += prod.precio * item.cantidad;
    }

    const ultimoPedido = await Pedido.findOne().sort({ numeroOrden: -1 });
    const numeroOrden =
      ultimoPedido && ultimoPedido.numeroOrden ? ultimoPedido.numeroOrden + 1 : 1;

    const nuevoPedido = new Pedido({
      numeroOrden,
      usuarioId,
      tiendaId: tiendaId || undefined,
      productos,
      fecha: fecha || Date.now(),
      total,
      estado: estado || "pendiente",
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    next(error);
  }
};

exports.obtenerPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find()
      .populate("usuarioId", "-password")
      .populate("tiendaId")
      .populate("productos.productoId");
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
};

exports.obtenerPedidoPorId = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("usuarioId", "-password")
      .populate("tiendaId")
      .populate("productos.productoId");

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    res.json(pedido);
  } catch (error) {
    next(error);
  }
};

exports.actualizarPedido = async (req, res, next) => {
  try {
    const { usuarioId, tiendaId, fecha, productos, estado } = req.body;

    const pedidoOriginal = await Pedido.findById(req.params.id);
    if (!pedidoOriginal) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Devolver stock de pedido original
    for (const item of pedidoOriginal.productos) {
      const prod = await Producto.findById(item.productoId);
      if (prod) {
        prod.stock += item.cantidad;
        await prod.save();
      }
    }

    const usuarioExiste = await Usuario.findById(usuarioId);
    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    let total = 0;
    for (const item of productos) {
      const prod = await Producto.findById(item.productoId);
      if (!prod) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      if (prod.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para: ${prod.nombre}` });
      }
      prod.stock -= item.cantidad;
      await prod.save();
      total += prod.precio * item.cantidad;
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      {
        usuarioId,
        tiendaId: tiendaId || undefined,
        productos,
        fecha: fecha || Date.now(),
        total,
        estado: estado || pedidoOriginal.estado,
      },
      { new: true }
    );

    res.json(pedidoActualizado);
  } catch (error) {
    next(error);
  }
};

exports.eliminarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Devolver stock al eliminar
    for (const item of pedido.productos) {
      const prod = await Producto.findById(item.productoId);
      if (prod) {
        prod.stock += item.cantidad;
        await prod.save();
      }
    }

    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Pedido eliminado" });
  } catch (error) {
    next(error);
  }
};

exports.renderPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.find()
      .populate("usuarioId")
      .populate("tiendaId")
      .populate("productos.productoId")
      .sort({ numeroOrden: -1 });
    res.render("pedidos", { pedidos });
  } catch (error) {
    next(error);
  }
};

exports.renderNuevoPedido = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().sort({ nombre: 1 });
    const productos = await Producto.find().sort({ nombre: 1 });
    const tiendas = await Tienda.find().sort({ nombre: 1 });
    res.render("nuevo-pedido", { usuarios, productos, tiendas });
  } catch (error) {
    next(error);
  }
};

exports.renderEditarPedido = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("usuarioId")
      .populate("tiendaId")
      .populate("productos.productoId");

    if (!pedido) {
      return res.status(404).send("Pedido no encontrado");
    }

    const usuarios = await Usuario.find().sort({ nombre: 1 });
    const productos = await Producto.find().sort({ nombre: 1 });
    const tiendas = await Tienda.find().sort({ nombre: 1 });

    res.render("editar-pedido", { pedido, usuarios, productos, tiendas });
  } catch (error) {
    next(error);
  }
};
