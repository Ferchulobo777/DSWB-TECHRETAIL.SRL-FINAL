const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  descripcion: {
    type: String,
  },
  imagen: {
    type: String,
  },
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tienda",
  },
});

module.exports = mongoose.model("Producto", productoSchema);
