import { validationResult } from 'express-validator';
import Tienda from '../../models/stores/Stores.js';
import ClienteWinet from '../../models/clients/ClienteWinetModel.js';
import logger from '../../utils/logger.js';

export const crearTienda = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Datos del cliente ya verificados por el middleware
    const { nombre, direccion, telefono } = req.body;
    const id_cliente = req.clientData.id;

    const tienda = await Tienda.create({
      id_cliente,
      nombre,
      direccion,
      telefono
    });

    logger.info('Tienda creada', { 
      tienda: tienda.id, 
      cliente: id_cliente 
    });

    res.status(201).json(tienda);
  } catch (error) {
    logger.error('Error al crear tienda:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// ... (otros métodos mantienen misma estructura pero pueden usar req.clientData)

export const obtenerTiendasPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;

    const tiendas = await Tienda.findAll({
      where: { id_cliente },
      include: [{
        model: ClienteWinet,
        as: 'cliente',
        attributes: ['nombre', 'codigo']
      }]
    });

    res.json(tiendas);
  } catch (error) {
    logger.error('Error al obtener tiendas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const actualizarTienda = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { nombre, direccion, telefono } = req.body;

    const tienda = await Tienda.findByPk(id);
    if (!tienda) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }

    await tienda.update({ nombre, direccion, telefono });
    res.json(tienda);
  } catch (error) {
    logger.error('Error al actualizar tienda:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const eliminarTienda = async (req, res) => {
  try {
    const { id } = req.params;

    const tienda = await Tienda.findByPk(id);
    if (!tienda) {
      return res.status(404).json({ message: 'Tienda no encontrada' });
    }

    await tienda.destroy();
    res.json({ message: 'Tienda eliminada correctamente' });
  } catch (error) {
    logger.error('Error al eliminar tienda:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};