const mongoose = require("mongoose");
const Pedido = require("../models/Pedido");

exports.renderMetrics = async (req, res, next) => {
  try {
    
    // 1. TOTAL GENERAL
    const totalPedidosPromise = Pedido.countDocuments();

    const ventasTotalesPromise = Pedido.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" }
        }
      }
    ]);

    const cantidadProductosPromise = Pedido.aggregate([
      { $unwind: "$productos" },
      {
        $group: {
          _id: null,
          total: { $sum: "$productos.cantidad" }
        }
      }
    ]);

    // 2. PEDIDOS POR SUCURSAL
    const pedidosPorSucursalPromise = Pedido.aggregate([
      {
        $lookup: {
          from: "tiendas",
          localField: "tiendaId",
          foreignField: "_id",
          as: "tienda"
        }
      },
      { $unwind: "$tienda" },
      {
        $group: {
          _id: "$tienda.nombre",
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // 3. VENTAS POR SUCURSAL
    const ventasPorSucursalPromise = Pedido.aggregate([
      {
        $lookup: {
          from: "tiendas",
          localField: "tiendaId",
          foreignField: "_id",
          as: "tienda"
        }
      },
      { $unwind: "$tienda" },
      {
        $group: {
          _id: "$tienda.nombre",
          total: { $sum: "$total" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // 4. PRODUCTOS MÁS VENDIDOS
    const productosMasVendidosPromise = Pedido.aggregate([
      { $unwind: "$productos" },
      {
        $lookup: {
          from: "productos",
          localField: "productos.productoId",
          foreignField: "_id",
          as: "producto"
        }
      },
      { $unwind: "$producto" },
      {
        $group: {
          _id: "$producto.nombre",
          cantidad: { $sum: "$productos.cantidad" }
        }
      },
      { $sort: { cantidad: -1 } }
    ]);

    // 5. TOP PRODUCTO POR SUCURSAL
    const topProductosPorSucursalPromise = Pedido.aggregate([
      { $unwind: "$productos" },

      {
        $lookup: {
          from: "productos",
          localField: "productos.productoId",
          foreignField: "_id",
          as: "producto"
        }
      },
      { $unwind: "$producto" },

      {
        $lookup: {
          from: "tiendas",
          localField: "tiendaId",
          foreignField: "_id",
          as: "tienda"
        }
      },
      { $unwind: "$tienda" },

      {
        $group: {
          _id: {
            sucursal: "$tienda.nombre",
            producto: "$producto.nombre"
          },
          cantidad: { $sum: "$productos.cantidad" }
        }
      },

      { $sort: { cantidad: -1 } },

      {
        $group: {
          _id: "$_id.sucursal",
          nombreProducto: { $first: "$_id.producto" },
          cantidad: { $first: "$cantidad" }
        }
      },

      {
        $project: {
          _id: 0,
          nombreSucursal: "$_id",
          nombreProducto: 1,
          cantidad: 1
        }
      }
    ]);


    const [
      totalPedidos,
      ventasTotalesArr,
      cantidadProductosArr,
      pedidosPorSucursal,
      ventasPorSucursal,
      productosMasVendidos,
      topProductosPorSucursal
    ] = await Promise.all([
      totalPedidosPromise,
      ventasTotalesPromise,
      cantidadProductosPromise,
      pedidosPorSucursalPromise,
      ventasPorSucursalPromise,
      productosMasVendidosPromise,
      topProductosPorSucursalPromise
    ]);


    const ventasTotales = ventasTotalesArr[0]?.total || 0;
    const cantidadProductos = cantidadProductosArr[0]?.total || 0;
    const productoMasVendidoCantidad = productosMasVendidos[0]?.cantidad || 0;

    return res.render("metrics", {
      data: {
        totalPedidos,
        ventasTotales,
        cantidadProductos,
        productoMasVendidoCantidad,
        pedidosPorSucursal,
        ventasPorSucursal,
        productosMasVendidos,
        topProductosPorSucursal
      }
    });

  } catch (error) {
    next(error);
  }
};