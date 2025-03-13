// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';  
import clientsRoutes from './routes/clients.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Middleware para loggear solicitudes
app.use(morgan('dev'));

// Middlewares
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Agregamos más métodos HTTP
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
  res.send('¡Servidor en funcionamiento!');
});

// Rutas
app.use('/api/client', clientsRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

export default app;
