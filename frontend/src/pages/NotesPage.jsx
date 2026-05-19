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
    <section className="notes page-fade" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1rem', height: '100vh', overflow: 'hidden' }}>
      <form className="glass" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }} onSubmit={onSubmit}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{editingId ? 'Edit note' : 'Create note'}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f1f1b', display: 'block' }}>Title</label>
          <input
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Your note title"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f1f1b', display: 'block' }}>Content</label>
          <textarea
            required
            rows={6}
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Write anything important..."
            style={{ resize: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f1f1b', display: 'block' }}>Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
            placeholder="work, ideas, roadmap"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Note' : 'Add Note'}
          </button>
          {editingId && (
            <button
              className="btn btn-ghost"
              style={{ flex: 1 }}
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

      <div className="glass" style={{ borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your notes</h2>
            <p style={{ color: '#5a584f' }}>{summary}</p>
          </div>
          <form
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e6e1d4', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#ffffff' }}
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Search size={18} style={{ color: '#5a584f', flexShrink: 0 }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to semantic-search..."
              style={{ flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#1f1f1b' }}
            />
          </form>
        </div>

        {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}

        <div style={{ flex: 1, overflowY: 'auto', marginTop: '1rem' }}>
          {loading || searching ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#5a584f' }}>
              Loading notes...
            </div>
          ) : notes.length ? (
            <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', paddingRight: '0.5rem' }}>
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#5a584f' }}>
              No notes found. Create your first one.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotesPage;
