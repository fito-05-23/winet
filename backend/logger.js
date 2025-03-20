// logger.js
import winston from 'winston';

// Configuración de niveles de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Configuración de colores para los niveles de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Formato de los logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Transportes (dónde se guardan los logs)
const transports = [
  // Logs en consola (para desarrollo)
  new winston.transports.Console(),

  // Logs en archivos (para producción)
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
  }),
];

// Crear el logger
const logger = winston.createLogger({
  level: 'info', // Nivel mínimo de log (puedes cambiarlo a 'debug' para desarrollo)
  levels,
  format,
  transports,
});

export default logger;