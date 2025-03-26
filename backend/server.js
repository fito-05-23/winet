import app from './app.js';
import logger from './utils/logger.js';
import sequelize from './config/db.js';
import { setupAssociations } from './models/associations.js'; // Asegúrate de que esta importación es correcta

const PORT = process.env.PORT || 3000;

const initializeServer = async () => {
  try {
    // 1. Conexión a la BD
    await sequelize.authenticate();
    logger.info('✅ Conexión a la base de datos establecida');

    // 2. Configurar relaciones
    await setupAssociations();
    
    // 3. Sincronizar modelos
    await sequelize.sync({ alter: true });
    logger.info('✅ Modelos sincronizados');

    // 4. Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Error de inicialización:', error);
    process.exit(1);
  }
};

initializeServer();