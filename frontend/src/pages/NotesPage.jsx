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
    <section className="notes page-fade grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 h-screen overflow-hidden">
      <form className="glass rounded-2xl p-6 space-y-4 overflow-y-auto" onSubmit={onSubmit}>
        <h2 className="text-2xl font-bold">{editingId ? 'Edit note' : 'Create note'}</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Title</label>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Your note title"
            className="w-full border border-border rounded-lg px-3 py-2 text-foreground bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Content</label>
          <textarea
            required
            rows={6}
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Write anything important..."
            className="w-full border border-border rounded-lg px-3 py-2 text-foreground bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="work, ideas, roadmap"
            className="w-full border border-border rounded-lg px-3 py-2 text-foreground bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-primary flex-1" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Note' : 'Add Note'}
          </button>
          {editingId && (
            <button
              className="btn btn-ghost flex-1"
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

      <div className="glass rounded-2xl p-6 flex flex-col overflow-hidden">
        <div className="space-y-4 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold">Your notes</h2>
            <p className="text-muted-foreground">{summary}</p>
          </div>
          <form
            className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 bg-input"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Search size={18} className="text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to semantic-search..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
            />
          </form>
        </div>

        {error && <div className="error-box mt-4">{error}</div>}

        <div className="flex-1 overflow-y-auto mt-4">
          {loading || searching ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading notes...
            </div>
          ) : notes.length ? (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pr-2">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No notes found. Create your first one.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotesPage;
