import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { api } from '../api/client';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  title: '',
  content: '',
  tags: '',
};

const NotesPage = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyForm);

  const loadNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getNotes(token);
      setNotes(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    document.body.classList.add('notes-workspace');

    return () => {
      document.body.classList.remove('notes-workspace');
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();

    const timer = setTimeout(async () => {
      if (!trimmed) {
        await loadNotes();
        return;
      }

      setSearching(true);
      setError('');
      try {
        const data = await api.searchNotes(token, trimmed);
        setNotes(data);
      } catch (err) {
        setError(err.message || 'Semantic search failed');
      } finally {
        setSearching(false);
      }
    }, 260);

    return () => clearTimeout(timer);
  }, [query, token]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.updateNote(token, editingId, payload);
      } else {
        await api.createNote(token, payload);
      }
      setForm(emptyForm);
      setEditingId('');
      if (query.trim()) {
        const data = await api.searchNotes(token, query.trim());
        setNotes(data);
      } else {
        await loadNotes();
      }
    } catch (err) {
      setError(err.message || 'Could not save note');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (note) => {
    setEditingId(note._id);
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(', ') || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    const accepted = window.confirm('Delete this note?');
    if (!accepted) {
      return;
    }

    try {
      await api.deleteNote(token, id);
      if (query.trim()) {
        const data = await api.searchNotes(token, query.trim());
        setNotes(data);
      } else {
        await loadNotes();
      }
    } catch (err) {
      setError(err.message || 'Could not delete note');
    }
  };

  const summary = useMemo(() => {
    const count = notes.length;
    const suffix = count === 1 ? 'note' : 'notes';
    return `${count} ${suffix} in view`;
  }, [notes]);

  return (
    <section className="notes page-fade">
      <div className="notes-grid">
        <form className="composer glass" onSubmit={onSubmit}>
          <h2>{editingId ? 'Edit note' : 'Create note'}</h2>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Your note title"
            />
          </label>
          <label>
            Content
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Write anything important..."
            />
          </label>
          <label>
            Tags (comma separated)
            <input
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              placeholder="work, ideas, roadmap"
            />
          </label>

          <div className="form-row">
            <button className="btn solid" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Note' : 'Add Note'}
            </button>
            {editingId && (
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  setEditingId('');
                  setForm(emptyForm);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="note-feed glass">
          <div className="feed-head glass">
            <div>
              <h2>Your notes</h2>
              <p>{summary}</p>
            </div>
            <form
              className="search-row"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type to semantic-search title/content"
              />
            </form>
          </div>

          {error && <div className="error-box">{error}</div>}

          {loading || searching ? (
            <div className="loading glass">Loading notes...</div>
          ) : notes.length ? (
            <div className="card-grid">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div className="loading glass">No notes found. Create your first one.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotesPage;
