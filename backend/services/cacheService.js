import NodeCache from 'node-cache';
import logger from '../utils/logger.js';

class CacheService {
  constructor(ttlSeconds = 300) { // TTL por defecto: 5 minutos (300 segundos)
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2, // Verificar expiraciones cada 20% del TTL
      useClones: false // Mejor rendimiento si no necesitas clones de objetos
    });

    logger.info(`Cache inicializado con TTL de ${ttlSeconds} segundos`);
  }

  async get(key) {
    try {
      const value = this.cache.get(key);
      if (value) {
        logger.debug(`Cache hit for key: ${key}`);
        return value;
      }
      logger.debug(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, ttl = null) {
    try {
      const success = ttl 
        ? this.cache.set(key, value, ttl)
        : this.cache.set(key, value);
      
      if (!success) {
        logger.warn(`Failed to set cache for key: ${key}`);
      }
      return success;
    } catch (error) {
      logger.error(`Error setting cache for key ${key}:`, error);
      return false;
    }
  }

  async delete(key) {
    try {
      const deleted = this.cache.del(key);
      logger.debug(`Deleted ${deleted} cache entries for key: ${key}`);
      return deleted > 0;
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}:`, error);
      return false;
    }
  }

  async flush() {
    try {
      this.cache.flushAll();
      logger.info('Cache completamente limpiado');
      return true;
    } catch (error) {
      logger.error('Error flushing cache:', error);
      return false;
    }
  }

  async stats() {
    return {
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      keys: this.cache.keys(),
      size: this.cache.getStats().keys
    };
  }
}

// Patrón Singleton para asegurar una única instancia
const cacheInstance = new CacheService();

export default cacheInstance;