import app from './app.js';
import logger from './utils/logger.js';
import sequelize from './config/db.js'; // Importa Sequelize en lugar de un pool de pg

const PORT = process.env.PORT || 3000;

// Función para probar la conexión con Sequelize
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate(); // Verifica conexión
    logger.info('✅ Conexión a la base de datos con Sequelize establecida correctamente.');

    // Sincroniza modelos (NO usar force: true en producción)
    await sequelize.sync({ alter: true }); 
    logger.info('✅ Modelos sincronizados correctamente.');
  } catch (error) {
    logger.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

// Inicia el servidor después de probar la conexión
app.listen(PORT, async () => {
  logger.info(`Servidor escuchando en http://localhost:${PORT}`);
  await testDatabaseConnection(); // Prueba la conexión a la base de datos
});
