const validateTienda = (req, res, next) => {

    const { nombre, direccion } = req.body;

    if (!nombre || !direccion) {
        return res.status(400).json({
            error: "Nombre y dirección obligatorios"
        });
    }

    next();
};

module.exports = validateTienda;