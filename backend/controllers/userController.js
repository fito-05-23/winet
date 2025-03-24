// controllers/userController.js
import User from '../models/User.js';
import logger from '../logger.js'; // Importar el logger

export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    logger.info(`Usuario creado: ${newUser.id}`);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Error al crear usuario: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    logger.info(`Usuarios obtenidos: ${users.length}`);
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Error al obtener usuarios: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};