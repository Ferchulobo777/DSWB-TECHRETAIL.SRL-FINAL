require('dotenv').config();
console.log('Arrancando app...');

const express = require('express');
const app = express();
const path = require('path');

// Configuración de Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const usuarioRoutes = require('./routes/usuario.routes');
console.log("Cargando rutas de usuarios...");
app.use('/usuarios', usuarioRoutes);

const tiendaRoutes = require('./routes/tienda.routes');
app.use('/tiendas', tiendaRoutes);

const productoRoutes = require('./routes/producto.routes'); 
app.use('/productos', productoRoutes);

const pedidoRoutes = require('./routes/pedido.routes');
app.use('/pedidos', pedidoRoutes);


// ruta de prueba
const webRoutes = require('./routes/web.routes');
app.use('/vistas', webRoutes);

// redirigir raíz a vistas por defecto para facilitar visualización
app.get('/', (req, res) => {
  res.redirect('/vistas');
});

// redirigir /login a /vistas/login para facilitar el acceso directo
app.get('/login', (req, res) => {
  res.redirect('/vistas/login');
});
const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);
module.exports = app;

