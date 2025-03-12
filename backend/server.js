// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientsRoutes from './routes/clients.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

//Middlewares
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(errorHandler);

// Importar y usar las rutas de usuarios
app.get('/', (req, res) => {
  res.send('¡Servidor en funcionamiento!');
});
app.use('/api/consultar-cliente', clientsRoutes);

// Loading Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});