const validateUsuario = (req, res, next) => {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({
            error: "Nombre, email y contraseña obligatorios"
        });
    }

    next();
};

module.exports = validateUsuario;