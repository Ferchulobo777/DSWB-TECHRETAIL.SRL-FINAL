const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/producto.controller");
const validateProducto = require("../middlewares/validateProducto");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, validateProducto, ctrl.crearProducto);
router.get("/", ctrl.obtenerProductos);
router.get("/:id", ctrl.obtenerProductoPorId);
router.put("/:id", authMiddleware, validateProducto, ctrl.actualizarProducto);
router.delete("/:id", authMiddleware, ctrl.eliminarProducto);

module.exports = router;
