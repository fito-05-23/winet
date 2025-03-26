import axios from 'axios';
import logger from '../utils/logger.js';

export const verifyClientStatus = async (req, res, next) => {
  try {
    // 1. Verificar autenticación básica
    if (!req.user) {
      logger.warn('Intento de acceso no autenticado a gestión de tiendas');
      return res.status(401).json({ error: 'No autenticado' });
    }

    // 2. Obtener ID del cliente desde el token o parámetros según tu implementación
    const idCliente = req.params.id_cliente || req.body.id_cliente;
    if (!idCliente) {
      logger.warn('Falta id_cliente en la solicitud', { user: req.user.id });
      return res.status(400).json({ error: 'Se requiere id_cliente' });
    }

    // 3. Consultar API externa
    const response = await axios.post(
      `${process.env.MIKROSYSTEM_API}${process.env.DETAILS_CLIENTS}`,
      {
        token: process.env.TOKEN_MIKROSYSTEM,
        idcliente: idCliente
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    logger.info('Respuesta API MikroSystem', { 
      cliente: idCliente, 
      estado: response.data?.estado 
    });

    // 4. Verificar estado del cliente
    if (response.data.estado !== 'exito' || 
        !response.data.datos || 
        response.data.datos[0]?.estado !== 'ACTIVO') {
      logger.warn('Cliente no activo', { 
        cliente: idCliente, 
        estado: response.data.datos[0]?.estado 
      });
      return res.status(403).json({ 
        error: 'Cliente no está activo en MikroSystem' 
      });
    }

    // 5. Almacenar datos del cliente para uso posterior
    req.clientData = response.data.datos[0];
    next();

  } catch (error) {
    logger.error('Error en verificación de cliente', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Error al verificar estado del cliente' 
    });
  }
};

export const verifyStoreOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idCliente = req.clientData?.id; // Del middleware anterior

    // Verificar que la tienda pertenece al cliente
    const store = await Tienda.findOne({ 
      where: { 
        id, 
        id_cliente: idCliente 
      } 
    });

    if (!store) {
      logger.warn('Intento de acceso a tienda no propia', {
        user: req.user.id,
        tienda: id
      });
      return res.status(403).json({ 
        error: 'No tienes permisos sobre esta tienda' 
      });
    }

    next();
  } catch (error) {
    logger.error('Error en verificación de propiedad', {
      error: error.message
    });
    res.status(500).json({ error: 'Error al verificar propiedad' });
  }
};