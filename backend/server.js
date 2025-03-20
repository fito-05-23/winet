// server.js
import app from './app.js';
import logger from './utils/logger.js';
import db from './config/db.js'; // Importa el pool de la base de datos

const PORT = process.env.PORT || 3000;

// Función para probar la conexión a la base de datos
const testDatabaseConnection = async () => {
  try {
    await db.query('SELECT NOW()'); // Ejecuta una consulta simple para verificar la conexión
    logger.info('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    logger.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Termina el proceso si la conexión falla
  }
};

// Inicia el servidor después de probar la conexión
app.listen(PORT, async () => {
  logger.info(`Servidor escuchando en http://localhost:${PORT}`);
  await testDatabaseConnection(); // Prueba la conexión a la base de datos
});