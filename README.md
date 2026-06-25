# TechRetail SRL – Sistema de Gestión Backend

Panel de administración para gestión de usuarios, productos, tiendas y pedidos.  
Desarrollado con **Node.js**, **Express**, **MongoDB** (Mongoose) y vistas **Pug**.

---

## Integrantes

| Nombre | Rol |
|--------|-----|
| Fernando Rodriguez | Integración MongoDB, CRUD Productos, Middlewares, Manejo de errores |
| Tomas Maldocena | Vistas Pug, Rutas Express, Validaciones |
| Vanesa Aracena | CRUD Pedidos, Testing endpoints, Modelos de datos |
| Nicolas Zenteno | CRUD Usuarios, Relaciones MongoDB, Documentación |

---

## Tecnologías

- **Node.js** – Entorno de ejecución
- **Express.js** – Framework backend
- **MongoDB + Mongoose** – Base de datos NoSQL y ODM
- **Pug** – Motor de plantillas HTML
- **JWT (jsonwebtoken)** – Autenticación por tokens
- **bcrypt** – Hasheo de contraseñas
- **dotenv** – Variables de entorno
- **Nodemon** – Desarrollo con recarga automática

---

## Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ferchulobo777/DSWB-TECHRETAIL.SRL.git
cd DSWB-TECHRETAIL.SRL
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/techretail
JWT_SECRET=clave_super_secreta
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm start
```

### 5. Acceder al panel

Abrir en el navegador: `http://localhost:3000`

---

## Estructura de carpetas

```
├── app.js                  # Configuración de Express
├── server.js               # Punto de entrada, conexión MongoDB
├── .env.example            # Variables de entorno de ejemplo
├── config/
│   └── db.js               # Conexión a MongoDB
├── controllers/            # Lógica de negocio
│   ├── usuario.controller.js
│   ├── producto.controller.js
│   ├── tienda.controller.js
│   └── pedido.controller.js
├── middlewares/            # Middlewares personalizados
│   ├── auth.middleware.js  # JWT autenticación y autorización
│   ├── error.middleware.js # Manejo centralizado de errores
│   ├── validateUsuario.js
│   ├── validateProducto.js
│   ├── validateTienda.js
│   └── validatePedido.js
├── models/                 # Esquemas Mongoose
│   ├── Usuario.js
│   ├── Producto.js
│   ├── Tienda.js
│   └── Pedido.js
├── routes/                 # Definición de rutas
│   ├── usuario.routes.js
│   ├── producto.routes.js
│   ├── tienda.routes.js
│   ├── pedido.routes.js
│   └── web.routes.js
├── views/                  # Plantillas Pug
│   ├── layout.pug
│   ├── index.pug
│   ├── login.pug
│   ├── usuarios.pug / nuevo-usuario.pug / editar-usuario.pug
│   ├── productos.pug / nuevo-producto.pug / editar-producto.pug
│   ├── tiendas.pug / nueva-tienda.pug / editar-tienda.pug
│   └── pedidos.pug / nuevo-pedido.pug / editar-pedido.pug
└── public/
    └── css/style.css
```

---

## Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/usuarios/login` | Login, devuelve JWT | No |

### Usuarios
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/usuarios` | Crear usuario | No |
| GET | `/usuarios` | Listar usuarios | Sí |
| GET | `/usuarios/:id` | Obtener por ID | Sí |
| PUT | `/usuarios/:id` | Actualizar | Sí |
| DELETE | `/usuarios/:id` | Eliminar (solo admin) | Sí + Admin |

### Productos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/productos` | Listar productos | No |
| GET | `/productos/:id` | Obtener por ID | No |
| POST | `/productos` | Crear producto | Sí |
| PUT | `/productos/:id` | Actualizar | Sí |
| DELETE | `/productos/:id` | Eliminar | Sí |

### Tiendas
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/tiendas` | Listar tiendas | No |
| GET | `/tiendas/:id` | Obtener por ID | No |
| POST | `/tiendas` | Crear tienda | Sí |
| PUT | `/tiendas/:id` | Actualizar | Sí |
| DELETE | `/tiendas/:id` | Eliminar | Sí |

### Pedidos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/pedidos` | Listar pedidos | Sí |
| GET | `/pedidos/:id` | Obtener por ID | Sí |
| POST | `/pedidos` | Crear pedido | Sí |
| PUT | `/pedidos/:id` | Actualizar | Sí |
| DELETE | `/pedidos/:id` | Eliminar | Sí |

---

## Características principales

- **Autenticación JWT**: Login devuelve un token que se guarda en `localStorage` y se envía como `Authorization: Bearer <token>` en cada request protegido.
- **Roles**: admin, vendedor, cliente. Solo admins pueden eliminar usuarios.
- **Gestión de stock**: Al crear un pedido, el stock se descuenta automáticamente. Al eliminar o actualizar un pedido, el stock se restaura.
- **Estado de pedidos**: pendiente, completado, cancelado.
- **Populate**: Los pedidos muestran datos completos de usuarios, productos y tiendas mediante `populate()`.
- **Manejo de errores centralizado**: Distingue errores de validación Mongoose, claves duplicadas, IDs inválidos y errores JWT.

---

## Credenciales demo

Para pruebas locales, crear un usuario admin en MongoDB directamente o mediante POST `/usuarios`:

```json
{
  "nombre": "Admin",
  "apellido": "Sistema",
  "email": "admin@gmail.com",
  "documento": "12345678",
  "password": "admin123",
  "rol": "admin"
}
```
