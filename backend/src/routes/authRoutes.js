import express from 'express';

import { getMe, signIn, signUp } from '../controllers/authController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', asyncHandler(signUp));
router.post('/signin', asyncHandler(signIn));
router.get('/me', protect, asyncHandler(getMe));

export default router;
