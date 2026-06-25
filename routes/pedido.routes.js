const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/pedido.controller");
const validatePedido = require("../middlewares/validatePedido");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, validatePedido, ctrl.crearPedido);
router.get("/", authMiddleware, ctrl.obtenerPedidos);
router.get("/:id", authMiddleware, ctrl.obtenerPedidoPorId);
router.put("/:id", authMiddleware, validatePedido, ctrl.actualizarPedido);
router.delete("/:id", authMiddleware, ctrl.eliminarPedido);

module.exports = router;
