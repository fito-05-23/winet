// controllers/stores/paymentController.js
import Pago from "../../models/stores/Pagos.js";
import Punto from "../../models/stores/Puntos.js";
import TransaccionPunto from "../../models/stores/TransaccionPuntos.js";
import Tienda from "../../models/stores/Stores.js";
import ClienteWinet from "../../models/clients/ClienteWinetModel.js";
import { checkMikrosystemStatus } from "../function/checkStatusClient.js";

const PUNTOS_POR_DOLAR = 1; // 1 punto por cada $1 gastado

export const registrarPago = async (req, res) => {
  try {
    // 1. Verificar que no sea auto-pago
    if (req.body.id_cliente === req.clientData.id) {
      return res.status(403).json({
        code: 'SELF_PAYMENT_NOT_ALLOWED',
        message: "No puedes registrarte pagos a ti mismo"
      });
    }

    // 2. Verificar que el cliente pagador existe
    const clientePagador = await ClienteWinet.findByPk(req.body.id_cliente, {
      attributes: ['id', 'nombre', 'idcliente', 'estado']
    });

    if (!clientePagador) {
      return res.status(404).json({ 
        code: 'CLIENT_NOT_FOUND',
        message: "El cliente que realiza el pago no existe" 
      });
    }

    // 3. Verificar estado del cliente pagador con MikroSystem
    const { isActive, estado } = await checkMikrosystemStatus(clientePagador.idcliente);
    
    if (!isActive) {
      return res.status(403).json({ 
        code: 'CLIENT_INACTIVE',
        message: "No se puede registrar el pago: el cliente pagador no está activo",
        estado,
        cliente: {
          id: clientePagador.id,
          nombre: clientePagador.nombre
        }
      });
    }

    // 4. Crear el pago (la tienda ya fue verificada por el middleware)
    const nuevoPago = await Pago.create({
      id_tienda: req.body.id_tienda,
      id_cliente: req.body.id_cliente,
      monto: req.body.monto,
      registrado_por: req.clientData.id
    });

    // 5. Asignar puntos (si corresponde)
    const puntosOtorgados = Math.floor(req.body.monto * PUNTOS_POR_DOLAR);
    
    if (puntosOtorgados > 0) {
      await asignarPuntos({
        idCliente: req.body.id_cliente,
        idTienda: req.body.id_tienda,
        puntos: puntosOtorgados,
        registradoPor: req.clientData.id
      });
    }

    // 6. Respuesta exitosa
    res.status(201).json({
      success: true,
      pago: {
        id: nuevoPago.id,
        monto: nuevoPago.monto,
        fecha: nuevoPago.createdAt
      },
      puntos_otorgados: puntosOtorgados,
      cliente_pagador: {
        id: clientePagador.id,
        nombre: clientePagador.nombre
      }
    });

  } catch (error) {
    console.error('Error en registrarPago:', error);
    res.status(500).json({
      code: 'PAYMENT_REGISTRATION_ERROR',
      message: "Error al registrar el pago",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Función auxiliar para asignar puntos
const asignarPuntos = async ({ idCliente, idTienda, puntos, registradoPor }) => {
  const [puntosCliente] = await Punto.findOrCreate({
    where: { id_cliente: idCliente },
    defaults: { puntos: 0 },
  });

  puntosCliente.puntos += puntos;
  await puntosCliente.save();

  await TransaccionPunto.create({
    id_cliente: idCliente,
    id_tienda: idTienda,
    tipo: "credito",
    puntos: puntos,
    registrado_por: registradoPor
  });
};

export const obtenerDetallePago = async (req, res) => {
  try {
    const pago = await models.Pago.findByPk(req.params.id_pago, {
      include: [
        {
          model: models.Tienda,
          as: "tienda",
          attributes: ["id", "nombre"],
        },
        {
          model: models.ClienteWinet,
          as: "cliente_pagador",
          attributes: ["id", "nombre"],
        },
      ],
    });

    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    // Verificar permisos: dueño de la tienda, cliente que pagó o admin
    const isTiendaOwner = pago.tienda.id_cliente === req.user.clientId;
    const isPagoOwner = pago.id_cliente === req.user.clientId;
    const isAdmin = req.user.role === "admin";

    if (!isTiendaOwner && !isPagoOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "No autorizado para ver este pago" });
    }

    res.status(200).json({
      ...pago.toJSON(),
      puntos_otorgados: Math.floor(pago.monto * PUNTOS_POR_DOLAR),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener detalle del pago",
      error: error.message,
    });
  }
};

export const obtenerPagosCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const { limit = 10, page = 1 } = req.query;

    // Validar parámetros de paginación
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedPage < 1) {
      return res
        .status(400)
        .json({ message: "Parámetros de paginación inválidos" });
    }

    // Verificar que el cliente existe
    const cliente = await models.ClienteWinet.findByPk(id_cliente);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Calcular offset para la paginación
    const offset = (parsedPage - 1) * parsedLimit;

    // Obtener pagos con información relacionada
    const { count, rows: pagos } = await models.Pago.findAndCountAll({
      where: { id_cliente },
      include: [
        {
          model: models.Tienda,
          as: "tienda",
          attributes: ["id", "nombre", "direccion"],
        },
        {
          model: models.ClienteWinet,
          as: "cliente_pagador",
          attributes: ["id", "nombre", "codigo"],
        },
      ],
      order: [["fecha_pago", "DESC"]],
      limit: parsedLimit,
      offset: offset,
    });

    // Calcular total de páginas
    const totalPaginas = Math.ceil(count / parsedLimit);

    res.status(200).json({
      pagos: pagos.map((pago) => ({
        ...pago.toJSON(),
        puntos_otorgados: Math.floor(pago.monto * PUNTOS_POR_DOLAR),
      })),
      total: count,
      paginas: totalPaginas,
      paginaActual: parsedPage,
    });
  } catch (error) {
    console.error("Error en obtenerPagosCliente:", error);
    res.status(500).json({
      message: "Error al obtener pagos del cliente",
      error: error.message,
    });
  }
};
