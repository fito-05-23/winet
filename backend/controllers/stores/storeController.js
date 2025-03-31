import { validationResult } from 'express-validator';
import cache from '../../services/cacheService.js';
import Tienda from '../../models/stores/Stores.js';
import ClienteWinet from '../../models/clients/ClienteWinetModel.js';
import logger from '../../utils/logger.js';

export const obtenerTodasLasTiendas = async (req, res) => {
  try {
    const cacheKey = 'all_stores';
    
    // Intentar obtener de caché primero
    const cachedStores = await cache.get(cacheKey);
    if (cachedStores) {
      return res.json(cachedStores);
    }

    // Si no está en caché, consultar DB
    const tiendas = await Tienda.findAll({
      include: [{
        model: ClienteWinet,
        as: 'cliente',
        attributes: ['nombre', 'codigo']
      }],
      order: [['nombre', 'ASC']] // Ordenar alfabéticamente
    });

    // Almacenar en caché (5-15 minutos recomendado para datos poco cambiantes)
    await cache.set(cacheKey, tiendas, 900); // 15 minutos

    res.json(tiendas);
  } catch (error) {
    logger.error('Error al obtener todas las tiendas:', error);
    res.status(500).json({ 
      message: 'Error al obtener las tiendas',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

export const obtenerTiendasPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const cacheKey = `tiendas:cliente:${id_cliente}`;

    // Intentar obtener de caché primero
    const cachedTiendas = await cache.get(cacheKey);
    if (cachedTiendas) {
      logger.debug('Tiendas obtenidas de caché', { id_cliente });
      return res.json(cachedTiendas);
    }

    // Si no está en caché, consultar DB
    const tiendas = await Tienda.findAll({
      where: { id_cliente },
      include: [{
        model: ClienteWinet,
        as: 'cliente',
        attributes: ['nombre', 'codigo']
      }]
    });

    // Almacenar en caché (5 minutos)
    await cache.set(cacheKey, tiendas, 300);
    logger.debug('Tiendas almacenadas en caché', { id_cliente });

    res.json(tiendas);
  } catch (error) {
    logger.error('Error al obtener tiendas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const crearTienda = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nombre, direccion, telefono } = req.body;
    const id_cliente = req.clientData.id;

    const tienda = await Tienda.create({
      id_cliente,
      nombre,
      direccion,
      telefono
    });

    // Invalidar caché de tiendas del cliente
    const cacheKey = `tiendas:cliente:${id_cliente}`;
    await cache.delete(cacheKey);
    logger.debug('Caché de tiendas invalidado', { id_cliente });

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

    // Invalidar caché de tiendas del cliente
    const cacheKey = `tiendas:cliente:${tienda.id_cliente}`;
    await cache.delete(cacheKey);
    logger.debug('Caché de tiendas invalidado por actualización', { 
      tiendaId: id,
      clienteId: tienda.id_cliente
    });

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

    const id_cliente = tienda.id_cliente;
    await tienda.destroy();

    // Invalidar caché de tiendas del cliente
    const cacheKey = `tiendas:cliente:${id_cliente}`;
    await cache.delete(cacheKey);
    logger.debug('Caché de tiendas invalidado por eliminación', { 
      tiendaId: id,
      clienteId: id_cliente
    });

    res.json({ message: 'Tienda eliminada correctamente' });
  } catch (error) {
    logger.error('Error al eliminar tienda:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

