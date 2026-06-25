const Producto = require("../models/Producto");





exports.crearProducto = async (req, res, next) => {
  try {
    const nuevoProducto = new Producto({
      codigo: req.body.codigo,
      nombre: req.body.nombre,
      precio: req.body.precio,
      stock: req.body.stock,
      descripcion: req.body.descripcion,
      tienda: req.body.tienda || undefined,
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};


exports.obtenerProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

exports.obtenerProductoPorId = async (req, res, next) => {

    try {

        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(producto);

    } catch (error) {

        next(error);

    }
};

exports.renderProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find().populate("tienda");
    res.render("productos", { productos });
  } catch (error) {
    next(error);
  }
};

exports.renderEditarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    const Tienda = require("../models/Tienda");
    const tiendas = await Tienda.find();

    res.render("editar-producto", { producto, tiendas });
  } catch (error) {
    next(error);
  }
};

exports.actualizarProducto = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(producto);
  } catch (error) {
    next(error);
  }
};

exports.eliminarProducto = async (req, res, next) => {

    try {

        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto eliminado"
        });

    } catch (error) {

        next(error);

    }

};