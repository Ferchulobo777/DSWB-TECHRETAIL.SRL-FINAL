const express = require("express");
const router = express.Router();

const productoCtrl = require("../controllers/producto.controller");
const usuarioCtrl = require("../controllers/usuario.controller");
const tiendaCtrl = require("../controllers/tienda.controller");
const pedidoCtrl = require("../controllers/pedido.controller");
const metricsCtrl = require("../controllers/metrics.controller");

const Tienda = require("../models/Tienda");
const Usuario = require("../models/Usuario");
const Producto = require("../models/Producto");
const Pedido = require("../models/Pedido");


// Dashboard / Home con estadísticas
router.get("/", async (req, res, next) => {
  try {
    const [totalUsuarios, totalProductos, totalTiendas, totalPedidos, pedidosRecientes] =
      await Promise.all([
        Usuario.countDocuments(),
        Producto.countDocuments(),
        Tienda.countDocuments(),
        Pedido.countDocuments(),
        Pedido.find()
          .populate("usuarioId", "nombre apellido")
          .populate("productos.productoId", "nombre")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.render("index", {
      stats: { totalUsuarios, totalProductos, totalTiendas, totalPedidos },
      pedidosRecientes,
    });
  } catch (error) {
    next(error);
  }
});

// Metrics dashboard
router.get("/metrics", metricsCtrl.renderMetrics);

// Login
router.get("/login", (req, res) => {
  res.render("login");
});

// Vistas de Datos
router.get("/productos", productoCtrl.renderProductos);
router.get("/productos/nuevo", async (req, res, next) => {
  try {
    const tiendas = await Tienda.find();
    res.render("nuevo-producto", { tiendas });
  } catch (error) {
    next(error);
  }
});
router.get("/productos/editar/:id", productoCtrl.renderEditarProducto);

router.get("/usuarios/nuevo", (req, res) => {
  res.render("nuevo-usuario");
});
router.get("/usuarios/editar/:id", usuarioCtrl.renderEditarUsuario);
router.get("/usuarios", usuarioCtrl.renderUsuarios);

router.get("/pedidos", pedidoCtrl.renderPedidos);
router.get("/pedidos/nuevo", pedidoCtrl.renderNuevoPedido);
router.get("/pedidos/editar/:id", pedidoCtrl.renderEditarPedido);

router.get("/tiendas/nuevo", (req, res) => {
  res.render("nueva-tienda");
});
router.get("/tiendas/editar/:id", tiendaCtrl.renderEditarTienda);
router.get("/tiendas", tiendaCtrl.renderTiendas);

module.exports = router;
