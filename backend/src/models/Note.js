import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    tags: {
      type: [String],
      default: [],
    },
    embedding: {
      type: [Number],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ owner: 1, title: 'text', content: 'text' });

noteSchema.methods.toJSON = function hideEmbedding() {
  const noteObject = this.toObject();
  delete noteObject.embedding;
  return noteObject;
};

const Note = mongoose.model('Note', noteSchema);

export default Note;
