import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import { getCurrentUser, updateProfile } from '../controllers/user.controller.js';

const router = Router();

// Get current user profile
router.get('/me', auth, getCurrentUser);

// Update user profile
router.put('/me', auth, updateProfile);

export default router;
