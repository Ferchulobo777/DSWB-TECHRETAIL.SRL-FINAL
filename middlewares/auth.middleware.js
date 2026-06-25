const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado." });
  }
};

const authAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Acceso restringido a administradores." });
};

module.exports = { authMiddleware, authAdmin };
