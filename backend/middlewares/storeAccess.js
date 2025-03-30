import axios from 'axios';
import logger from '../utils/logger.js';
import ClienteWinet from '../models/clients/ClienteWinetModel.js';

export const verifyClientStatus = async (req, res, next) => {
  // Función auxiliar dentro del middleware
  const getStatusMessage = (estado) => {
    const messages = {
      'ACTIVO': 'Cuenta activa',
      'SUSPENDIDO': 'Cuenta suspendida. Para poder operar con la aplicación Winet, debe regular su situación.',
      'RETIRADO': 'Cuenta retirada. No se puede proceder con la operación en la aplicación Winet.',
      'NO_RESPONSE': 'No se pudo verificar el estado con MikroSystem',
      'API_ERROR': 'Error al conectar con el sistema de verificación',
      'INACTIVO': 'Cuenta inactiva en el sistema local' // Nuevo estado agregado
    };
    return messages[estado] || 'Estado de cuenta no reconocido';
  };

  // Función auxiliar dentro del middleware
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

      logger.debug('Respuesta completa de MikroSystem:', { 
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

    logger.debug('Iniciando verificación para usuario:', { 
      userId: req.user.id 
    });

    // 2. Obtener perfil del cliente
    const cliente = await ClienteWinet.findOne({
      where: { id_user: req.user.id },
      attributes: ['id', 'idcliente', 'nombre', 'estado', 'correo']
    });

    if (!cliente) {
      logger.warn('No se encontró cliente para el usuario:', { 
        userId: req.user.id 
      });
      return res.status(403).json({ 
        code: 'NOT_A_CLIENT',
        error: 'No tienes permisos para esta acción' 
      });
    }

    logger.debug('Datos del cliente encontrado:', { 
      cliente: cliente.get({ plain: true }) 
    });

    // 3. Verificar estado local
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

    // 4. Verificar estado en MikroSystem
    const mikrosystemStatus = await checkMikrosystemStatus(cliente.idcliente);
    
    logger.debug('Resultado de MikroSystem:', mikrosystemStatus);

    if (!mikrosystemStatus.isActive) {
      const errorMessage = getStatusMessage(mikrosystemStatus.estado);
      logger.warn('Estado en MikroSystem no activo:', {
        estado: mikrosystemStatus.estado,
        message: errorMessage
      });
      return res.status(403).json({
        code: 'MIKROSYSTEM_ACCOUNT_INACTIVE',
        error: errorMessage,
        status: mikrosystemStatus.estado,
        details: process.env.NODE_ENV === 'development' ? mikrosystemStatus.rawResponse : undefined
      });
    }

    // 5. Adjuntar datos para siguientes middlewares
    req.clientData = {
      ...cliente.get({ plain: true }),
      mikrosystemData: mikrosystemStatus.data
    };
    
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