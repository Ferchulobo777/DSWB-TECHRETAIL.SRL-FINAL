const validatePedido = (req, res, next) => {

    const { usuarioId, productos } = req.body;

    if (!usuarioId) {
        return res.status(400).json({
            error: "Usuario obligatorio"
        });
    }

    if (!productos || productos.length === 0) {
        return res.status(400).json({
            error: "Debe agregar productos"
        });
    }

    next();
};

module.exports = validatePedido;