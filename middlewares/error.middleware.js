const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Error de validación", detalles: mensajes });
  }

  // Error de clave duplicada (unique)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `Ya existe un registro con ese ${campo}.` });
  }

  // Error de CastError (id inválido)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "ID con formato inválido." });
  }

  // JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Token inválido." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expirado." });
  }

  // Error genérico
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
};

module.exports = errorHandler;
