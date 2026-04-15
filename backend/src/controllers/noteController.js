import Note from '../models/Note.js';
import { buildNoteEmbedding, cosineSimilarity, getTextEmbedding } from '../utils/embedding.js';

const normalizeTags = (tags = []) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag).trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);
};

export const createNote = async (req, res) => {
  const { title, content, tags } = req.body || {};

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  const note = await Note.create({
    owner: req.user._id,
    title,
    content,
    tags: normalizeTags(tags),
    embedding: buildNoteEmbedding({ title, content }),
  });

  return res.status(201).json(note);
};

export const getNotes = async (req, res) => {
  const notes = await Note.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  return res.status(200).json(notes);
};

export const searchNotes = async (req, res) => {
  const rawQuery = String(req.query.q || '').trim();

  if (!rawQuery) {
    return res.status(200).json([]);
  }

  const queryVector = getTextEmbedding(rawQuery);
  const queryTerms = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const notes = await Note.find({ owner: req.user._id }).lean();

  const ranked = notes
    .map((note) => {
      const semanticScore = cosineSimilarity(queryVector, note.embedding || []);
      const combinedText = `${note.title || ''} ${note.content || ''}`.toLowerCase();
      const lexicalHits = queryTerms.reduce(
        (hits, term) => (combinedText.includes(term) ? hits + 1 : hits),
        0,
      );
      const lexicalScore = queryTerms.length ? lexicalHits / queryTerms.length : 0;
      const score = semanticScore * 0.75 + lexicalScore * 0.25;

      return {
        ...note,
        semanticScore: Number(semanticScore.toFixed(4)),
        score,
      };
    })
    .filter((note) => note.score > 0.08)
    .sort((a, b) => b.score - a.score || new Date(b.updatedAt) - new Date(a.updatedAt));

  const sanitized = ranked.map(({ embedding, score, ...note }) => note);
  return res.status(200).json(sanitized);
};

export const getNoteById = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  return res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const { title, content, tags, isArchived } = req.body || {};

  if (typeof title === 'string') {
    note.title = title;
  }
  if (typeof content === 'string') {
    note.content = content;
  }
  if (tags !== undefined) {
    note.tags = normalizeTags(tags);
  }
  if (typeof isArchived === 'boolean') {
    note.isArchived = isArchived;
  }

  if (typeof title === 'string' || typeof content === 'string') {
    note.embedding = buildNoteEmbedding({ title: note.title, content: note.content });
  }

  await note.save();
  return res.status(200).json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  return res.status(200).json({ message: 'Note deleted successfully' });
};
