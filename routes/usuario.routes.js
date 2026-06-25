const express = require("express");
const router = express.Router();

const validateUsuario = require("../middlewares/validateUsuario");
const { authMiddleware, authAdmin } = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/usuario.controller");

// Ruta pública: login
router.post("/login", ctrl.login);

// Rutas protegidas
router.post("/", validateUsuario, ctrl.crearUsuario);
router.get("/", authMiddleware, ctrl.obtenerUsuarios);
router.get("/:id", authMiddleware, ctrl.obtenerUsuarioPorId);
router.put("/:id", authMiddleware, ctrl.actualizarUsuario);
router.delete("/:id", authMiddleware, authAdmin, ctrl.eliminarUsuario);

module.exports = router;
