// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import logger from './utils/logger.js';  
import clientsRoutes from './routes/clients/clientesRoutes.js';
import authRoutes from './routes/auth/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import passwordResetRoutes from './routes/auth/passwordReset.js';

dotenv.config();

const app = express();

// Middleware para loggear solicitudes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Middlewares
const corsOptions = {
  origin: process.env.ORIGIN || '*', // Usa '*' para permitir todos los orígenes (no recomendado en producción)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());  // Seguridad HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Servidor en funcionamiento!');
});

// Rutas
app.use('/api/client', clientsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reset-password', passwordResetRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;