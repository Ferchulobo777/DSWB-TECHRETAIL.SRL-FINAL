const validateProducto = (req, res, next) => {

    const { codigo, nombre, precio, stock } = req.body;

    if (!codigo) {
        return res.status(400).json({
            error: "Código obligatorio"
        });
    }

    if (!nombre) {
        return res.status(400).json({
            error: "Nombre obligatorio"
        });
    }

    if (precio <= 0) {
        return res.status(400).json({
            error: "Precio inválido"
        });
    }

    if (stock < 0) {
        return res.status(400).json({
            error: "Stock inválido"
        });
    }

    next();
};

module.exports = validateProducto;