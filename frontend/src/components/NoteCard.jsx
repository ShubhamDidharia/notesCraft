import { PencilLine, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <article className="note-card glass" style={{ padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f1f1b', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{note.title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button 
            type="button" 
            className="btn-icon"
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            <PencilLine size={16} />
          </button>
          <button 
            type="button" 
            className="btn-icon"
            style={{ color: '#b72222' }}
            onClick={() => onDelete(note._id)}
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p style={{ color: '#5a584f', fontSize: '0.875rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.6' }}>{note.content}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {note.tags?.length ? (
          note.tags.map((tag) => (
            <span key={tag} style={{ fontSize: '0.75rem', backgroundColor: 'rgba(209, 77, 54, 0.1)', color: '#a53623', borderRadius: '9999px', padding: '0.25rem 0.5rem' }}>
              #{tag}
            </span>
          ))
        ) : (
          <span style={{ fontSize: '0.75rem', backgroundColor: '#e6e1d4', color: '#5a584f', borderRadius: '9999px', padding: '0.25rem 0.5rem' }}>#general</span>
        )}
      </div>
      <p style={{ fontSize: '0.75rem', color: '#5a584f', paddingTop: '0.5rem', borderTop: '1px solid #e6e1d4', borderTopOpacity: 0.5 }}>
        Updated: {formatDate(note.updatedAt)}
      </p>
    </article>
  );
};

export default NoteCard;
