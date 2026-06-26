const Tienda = require("../models/Tienda");
const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");

function generarSlug(texto) {
  return texto
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

exports.crearTienda = async (req, res, next) => {
  try {
    const slug = generarSlug(req.body.nombre);
    const nuevaTienda = new Tienda({
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      slug,
    });

    await nuevaTienda.save();
    res.status(201).json(nuevaTienda);
  } catch (error) {
    next(error);
  }
};


exports.obtenerTiendas = async (req, res, next) => {
  try {
    const tiendas = await Tienda.find();
    res.json(tiendas);
  } catch (error) {
    next(error);
  }
};
exports.obtenerTiendaPorId = async (req, res, next) => {
  try {
    const tienda = await Tienda.findById(req.params.id);

    if (!tienda) {
      return res.status(404).json({
        error: "Tienda no encontrada",
      });
    }

    res.json(tienda);
  } catch (error) {
    next(error);
  }
};

exports.renderTiendas = async (req, res, next) => {
  try {
    const tiendas = await Tienda.find();
    const productos = await Producto.aggregate([
      { $group: { _id: "$tienda", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    productos.forEach(function(p) {
      countMap[p._id] = p.count;
    });
    res.render("tiendas", { tiendas, countMap });
  } catch (error) {
    next(error);
  }
};

exports.renderEditarTienda = async (req, res, next) => {
  try {
    const tienda = await Tienda.findById(req.params.id);
    if (!tienda) {
      return res.status(404).send("Tienda no encontrada");
    }
    res.render("editar-tienda", { tienda });
  } catch (error) {
    next(error);
  }
};

exports.renderTiendaPublica = async (req, res, next) => {
  try {
    const tienda = await Tienda.findOne({ slug: req.params.slug });
    if (!tienda) {
      return res.status(404).send("Tienda no encontrada");
    }
    const productos = await Producto.find({ tienda: tienda._id });
    const usuarios = await Usuario.find().sort({ nombre: 1 });
    res.render("tienda-publica", { tienda, productos, usuarios });
  } catch (error) {
    next(error);
  }
};

exports.actualizarTienda = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (updateData.nombre) {
      updateData.slug = generarSlug(updateData.nombre);
    }
    const tienda = await Tienda.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!tienda) {
      return res.status(404).json({
        error: "Tienda no encontrada",
      });
    }

    res.json(tienda);
  } catch (error) {
    next(error);
  }
};

exports.eliminarTienda = async (req, res, next) => {
  try {
    const tienda = await Tienda.findByIdAndDelete(req.params.id);

    if (!tienda) {
      return res.status(404).json({
        error: "Tienda no encontrada",
      });
    }

    res.json({
      mensaje: "Tienda eliminada",
    });
  } catch (error) {
    next(error);
  }
};
