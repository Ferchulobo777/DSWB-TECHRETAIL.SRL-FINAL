const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    documento: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ["admin", "vendedor", "cliente"],
        default: "cliente",
    },
    ciudad: {
        type: String,
        required: false
    }
    },
{
    timestamps: true
});

module.exports = mongoose.model("Usuario", usuarioSchema);