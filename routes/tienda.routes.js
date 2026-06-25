const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/tienda.controller");
const validateTienda = require("../middlewares/validateTienda");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, validateTienda, ctrl.crearTienda);
router.get("/", ctrl.obtenerTiendas);
router.get("/:id", ctrl.obtenerTiendaPorId);
router.put("/:id", authMiddleware, validateTienda, ctrl.actualizarTienda);
router.delete("/:id", authMiddleware, ctrl.eliminarTienda);

module.exports = router;
