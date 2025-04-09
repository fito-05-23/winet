import axios from 'axios';
import logger from '../../utils/logger.js'; // Importar el logger de Winston

export const checkMikrosystemStatus = async (idCliente) => {
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