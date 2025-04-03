// controllers/stores/paymentController.js
import Pago from "../../models/stores/Pagos.js";
import Punto from "../../models/stores/Puntos.js";
import TransaccionPunto from "../../models/stores/TransaccionPuntos.js";
import Tienda from "../../models/stores/Stores.js";
import ClienteWinet from "../../models/clients/ClienteWinetModel.js";

const PUNTOS_POR_DOLAR = 1; // 1 punto por cada $1 gastado

export const registrarPago = async (req, res) => {
  try {
    // 1. Verificar que la tienda pertenece al cliente que registra el pago
    const tienda = await Tienda.findOne({
      where: {
        id: req.body.id_tienda,
        id_cliente: req.user.clientId,
      },
    });

    if (!tienda) {
      return res
        .status(403)
        .json({
          message: "No tienes permiso para registrar pagos en esta tienda",
        });
    }

    // 2. Verificar que el cliente que realiza el pago existe
    const clientePagador = await ClienteWinet.findByPk(req.body.id_cliente);
    if (!clientePagador) {
      return res
        .status(404)
        .json({ message: "El cliente que realiza el pago no existe" });
    }

    // 3. Crear el pago
    const nuevoPago = await Pago.create({
      id_tienda: req.body.id_tienda,
      id_cliente: req.body.id_cliente,
      monto: req.body.monto,
    });

    // 4. Calcular y asignar puntos al cliente que realizó el pago
    const puntosOtorgados = Math.floor(req.body.monto * PUNTOS_POR_DOLAR);

    if (puntosOtorgados > 0) {
      // Buscar o crear registro de puntos del cliente que pagó
      const [puntosCliente, created] = await Punto.findOrCreate({
        where: { id_cliente: req.body.id_cliente },
        defaults: { puntos: 0 },
      });

      // Actualizar puntos
      puntosCliente.puntos += puntosOtorgados;
      await puntosCliente.save();

      // Registrar transacción de puntos
      await TransaccionPunto.create({
        id_cliente: req.body.id_cliente,
        id_tienda: req.body.id_tienda,
        tipo: "credito",
        puntos: puntosOtorgados,
      });
    }

    res.status(201).json({
      pago: nuevoPago,
      puntos_otorgados: puntosOtorgados,
      cliente_pagador: {
        id: clientePagador.id,
        nombre: clientePagador.nombre,
      },
      tienda: {
        id: tienda.id,
        nombre: tienda.nombre,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al registrar pago",
      error: error.message,
    });
  }
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
        return res.status(400).json({ message: 'Parámetros de paginación inválidos' });
      }
  
      // Verificar que el cliente existe
      const cliente = await models.ClienteWinet.findByPk(id_cliente);
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
  
      // Calcular offset para la paginación
      const offset = (parsedPage - 1) * parsedLimit;
  
      // Obtener pagos con información relacionada
      const { count, rows: pagos } = await models.Pago.findAndCountAll({
        where: { id_cliente },
        include: [
          {
            model: models.Tienda,
            as: 'tienda',
            attributes: ['id', 'nombre', 'direccion']
          },
          {
            model: models.ClienteWinet,
            as: 'cliente_pagador',
            attributes: ['id', 'nombre', 'codigo']
          }
        ],
        order: [['fecha_pago', 'DESC']],
        limit: parsedLimit,
        offset: offset
      });
  
      // Calcular total de páginas
      const totalPaginas = Math.ceil(count / parsedLimit);
  
      res.status(200).json({
        pagos: pagos.map(pago => ({
          ...pago.toJSON(),
          puntos_otorgados: Math.floor(pago.monto * PUNTOS_POR_DOLAR)
        })),
        total: count,
        paginas: totalPaginas,
        paginaActual: parsedPage
      });
  
    } catch (error) {
      console.error('Error en obtenerPagosCliente:', error);
      res.status(500).json({ 
        message: 'Error al obtener pagos del cliente',
        error: error.message 
      });
    }
  };