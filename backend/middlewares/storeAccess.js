import axios from 'axios';
import cache from '../services/cacheService.js';
import logger from '../utils/logger.js';
import ClienteWinet from '../models/clients/ClienteWinetModel.js';
import Tienda from '../../models/stores/Stores.js';

export const verifyClientStatus = async (req, res, next) => {
  // Función auxiliar para mensajes de estado
  const getStatusMessage = (estado) => {
    const statusMessages = {
      'ACTIVO': 'Cuenta activa',
      'SUSPENDIDO': 'Cuenta suspendida. Para poder operar con la aplicación Winet, debe regular su situación.',
      'RETIRADO': 'Cuenta retirada. No se puede proceder con la operación en la aplicación Winet.',
      'NO_RESPONSE': 'No se pudo verificar el estado con MikroSystem',
      'API_ERROR': 'Error al conectar con el sistema de verificación',
      'INACTIVO': 'Cuenta inactiva en el sistema local'
    };
    return statusMessages[estado] || 'Estado de cuenta no reconocido';
  };

  // Función para verificar estado en MikroSystem
  const checkMikrosystemStatus = async (idCliente) => {
    try {
      const response = await axios.post(
        `${process.env.MIKROSYSTEM_API}${process.env.DETAILS_CLIENTS}`,
        {
          token: process.env.TOKEN_MIKROSYSTEM,
          idcliente: idCliente
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );

      logger.debug('Respuesta de MikroSystem:', { 
        data: response.data 
      });

      if (!response.data || response.data.estado !== 'exito' || !response.data.datos?.[0]?.estado) {
        return { 
          isActive: false, 
          estado: 'NO_RESPONSE', 
          data: null,
          rawResponse: response?.data 
        };
      }

      return {
        isActive: response.data.datos[0].estado === 'ACTIVO',
        estado: response.data.datos[0].estado,
        data: response.data.datos[0],
        rawResponse: response.data
      };
    } catch (error) {
      logger.error('Error en consulta a MikroSystem:', {
        error: error.message,
        response: error.response?.data,
        config: error.config
      });
      return { 
        isActive: false, 
        estado: 'API_ERROR', 
        data: null,
        errorDetails: error.message 
      };
    }
  };

  try {
    // 1. Verificar autenticación
    if (!req.user || !req.user.id) {
      logger.error('Usuario no autenticado o sin ID', { user: req.user });
      return res.status(401).json({ 
        code: 'UNAUTHENTICATED',
        error: 'No autenticado' 
      });
    }

    const userId = req.user.id;
    const cacheKey = `clientStatus:${userId}`;

    logger.debug('Iniciando verificación para usuario:', { userId });

    // 2. Verificar caché primero
    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      logger.debug('Datos obtenidos de caché', { 
        userId,
        source: 'cache',
        estado: cachedData.estado
      });

      if (cachedData.estado === 'ACTIVO') {
        req.clientData = cachedData;
        return next();
      }
      
      // Si está en caché pero no está activo, continuar con verificación
    }

    // 3. Obtener datos del cliente desde DB
    const cliente = await ClienteWinet.findOne({
      where: { id_user: userId },
      attributes: ['id', 'idcliente', 'nombre', 'estado', 'correo']
    });

    if (!cliente) {
      logger.warn('Cliente no encontrado para el usuario:', { userId });
      return res.status(403).json({ 
        code: 'NOT_A_CLIENT',
        error: 'No tienes permisos para esta acción' 
      });
    }

    logger.debug('Datos del cliente encontrado:', cliente.get({ plain: true }));

    // 4. Verificar estado local
    if (cliente.estado !== 'ACTIVO') {
      const errorMessage = getStatusMessage(cliente.estado);
      logger.warn('Estado local no activo:', { 
        estado: cliente.estado,
        message: errorMessage
      });
      return res.status(403).json({
        code: 'LOCAL_ACCOUNT_INACTIVE',
        error: errorMessage,
        estado: cliente.estado,
        clienteId: cliente.id
      });
    }

    // 5. Verificar estado en MikroSystem
    const mikrosystemStatus = await checkMikrosystemStatus(cliente.idcliente);
    
    logger.debug('Resultado de MikroSystem:', mikrosystemStatus);

    // 6. Preparar datos para respuesta y caché
    const clientData = {
      ...cliente.get({ plain: true }),
      mikrosystemData: mikrosystemStatus.data,
      estado: mikrosystemStatus.estado,
      isActive: mikrosystemStatus.isActive,
      lastUpdated: new Date().toISOString()
    };

    // 7. Manejo del caché
    if (mikrosystemStatus.isActive) {
      // Almacenar en caché solo si el estado es ACTIVO
      await cache.set(cacheKey, clientData);
      logger.debug('Datos almacenados en caché', { 
        userId,
        ttl: '300 segundos' 
      });
    } else {
      // Si no está activo, limpiar caché existente
      await cache.delete(cacheKey);
      logger.debug('Datos eliminados de caché por estado inactivo', { 
        userId,
        estado: mikrosystemStatus.estado 
      });
    }

    // 8. Adjuntar datos al request
    req.clientData = clientData;
    next();
  } catch (error) {
    logger.error('Error crítico en verifyClientStatus:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    return res.status(500).json({ 
      code: 'SERVER_ERROR',
      error: 'Error al verificar estado del cliente',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const verifyStoreOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idCliente = req.clientData?.id;

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