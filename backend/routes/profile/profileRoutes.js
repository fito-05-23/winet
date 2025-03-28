// routes/profile/profileRoutes.js

import express from 'express';
import { getUserProfile } from '../../controllers/clients/clientController.js';
import { verifyToken, checkRole } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';

const router = express.Router();

// Validaciones para el login
router.get("/", verifyToken, getUserProfile);
 
export default router;


