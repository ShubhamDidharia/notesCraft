import express from 'express';

import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  searchNotes,
  updateNote,
} from '../controllers/noteController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/search', asyncHandler(searchNotes));
router.route('/').post(asyncHandler(createNote)).get(asyncHandler(getNotes));
router
  .route('/:id')
  .get(asyncHandler(getNoteById))
  .put(asyncHandler(updateNote))
  .delete(asyncHandler(deleteNote));

export default router;
