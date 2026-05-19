import { PencilLine, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <article className="note-card glass rounded-2xl p-4 border border-border bg-white/78 hover:shadow-md hover:border-primary/30 transition-all space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-foreground line-clamp-2">{note.title}</h3>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            type="button" 
            className="btn-icon hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            <PencilLine size={16} />
          </button>
          <button 
            type="button" 
            className="btn-icon hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={() => onDelete(note._id)}
            title="Delete note"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{note.content}</p>
      <div className="flex flex-wrap gap-2">
        {note.tags?.length ? (
          note.tags.map((tag) => (
            <span key={tag} className="note-tag text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
              #{tag}
            </span>
          ))
        ) : (
          <span className="note-tag text-xs bg-muted text-muted-foreground rounded-full px-2 py-1">#general</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
        Updated: {formatDate(note.updatedAt)}
      </p>
    </article>
  );
};

export default NoteCard;
