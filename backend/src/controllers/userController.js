import Note from '../models/Note.js';

export const getProfile = async (req, res) => {
  const noteCount = await Note.countDocuments({ owner: req.user._id });
  const archivedCount = await Note.countDocuments({ owner: req.user._id, isArchived: true });

  return res.status(200).json({
    ...req.user.toObject(),
    stats: {
      noteCount,
      archivedCount,
      activeCount: noteCount - archivedCount,
    },
  });
};
