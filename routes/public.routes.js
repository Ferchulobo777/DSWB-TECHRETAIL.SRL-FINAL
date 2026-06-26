const express = require("express");
const router = express.Router();

const tiendaCtrl = require("../controllers/tienda.controller");
const pedidoCtrl = require("../controllers/pedido.controller");

router.get("/tienda/:slug", tiendaCtrl.renderTiendaPublica);
router.post("/tienda/:slug/checkout", pedidoCtrl.crearPedidoPublico);

module.exports = router;
