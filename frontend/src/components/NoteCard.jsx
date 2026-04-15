import { PencilLine, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <article className="note-card glass">
      <div className="note-head">
        <h3>{note.title}</h3>
        <div className="note-actions">
          <button type="button" className="icon-btn" onClick={() => onEdit(note)}>
            <PencilLine size={16} />
          </button>
          <button type="button" className="icon-btn danger" onClick={() => onDelete(note._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p>{note.content}</p>
      <div className="note-tags">
        {note.tags?.length ? note.tags.map((tag) => <span key={tag}>#{tag}</span>) : <span>#general</span>}
      </div>
      <small>Updated: {formatDate(note.updatedAt)}</small>
    </article>
  );
};

export default NoteCard;
