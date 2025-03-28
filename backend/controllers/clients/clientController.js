// controllers/clients/clientController.js
import axios from 'axios';
import ClienteWinet from '../../models/clients/ClienteWinetModel.js';
import logger from '../../utils/logger.js'; // Importar el logger de Winston

export const getClientStatus = async (req, res, next) => {
  // Log de la solicitud
  logger.info(`Solicitud recibida: ${req.method} ${req.url}`);
  logger.info(`Body recibido: ${JSON.stringify(req.body)}`);
  logger.info(`URL de la API externa: ${process.env.MIKROSYSTEM_API}`);

  const { token, idcliente } = req.body;

  if (!token || !idcliente) {
    logger.warn('❌ Faltan datos en la solicitud');
    return res.status(400).json({ error: 'Faltan datos (token, idcliente)' });
  }

  try {
    // Construye la URL completa para la solicitud
    const url = `${process.env.MIKROSYSTEM_API}${process.env.DETAILS_CLIENTS}`;
    logger.info(`URL de la API externa: ${url}`);

    // Realiza la solicitud POST a la API de MikroSystem
    const response = await axios.post(
      url,
      {
        token: process.env.TOKEN_MIKROSYSTEM, // Usa el token desde las variables de entorno
        idcliente, // Usa el idcliente desde el body de la solicitud
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    logger.info('✅ Respuesta de MikroSystem:', { data: response.data });

    res.status(200).json(response.data);
  } catch (error) {
    logger.error(`❌ Error en la API de MikroSystem: ${error.message}`);
    next(error);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar el cliente asociado al usuario
    const cliente = await ClienteWinet.findOne({
      where: { id_user: userId },
      attributes: ['id', 'idcliente', 'nombre', 'estado', 'correo', 'telefono', 'movil', 'cedula', 'pasarela', 'codigo', 'direccion_principal'],
    });

    if (!cliente) {
      logger.warn(`Cliente no encontrado para el usuario con ID: ${userId}`);
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ cliente });
  } catch (error) {
    logger.error(`❌ Error al obtener el perfil del cliente: ${error.message}`);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

