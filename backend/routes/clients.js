// routes/clients.js
import express from 'express';
import clientController from '../controllers/clientController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Usa POST para consultar el estado de un cliente' });
});

router.post('/', clientController.getClientStatus);

export default router;