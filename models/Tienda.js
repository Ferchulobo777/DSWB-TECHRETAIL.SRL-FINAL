const mongoose = require("mongoose");

const tiendaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    direccion: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Tienda", tiendaSchema);