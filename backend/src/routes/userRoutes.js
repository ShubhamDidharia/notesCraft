import express from 'express';

import { getProfile } from '../controllers/userController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, asyncHandler(getProfile));

export default router;
