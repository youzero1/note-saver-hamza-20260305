'use client';

import { useState, useEffect, useCallback } from 'react';
import { NoteData, NoteCategory, NotePriority, CreateNoteDto } from '../types';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function HomePage() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NoteCategory | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<NotePriority | ''>('');
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<NoteData | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<NoteData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Note Saver';

  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const fetchNotes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter) params.set('category', categoryFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      const res = await fetch(`/api/notes?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setNotes(data);
    } catch {
      addToast('error', 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, priorityFilter]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => fetchNotes(), 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  const handleCreate = async (data: CreateNoteDto) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create');
      await fetchNotes();
      setShowForm(false);
      addToast('success', 'Note created successfully!');
    } catch {
      addToast('error', 'Failed to create note');
    }
  };

  const handleUpdate = async (data: CreateNoteDto) => {
    if (!editNote) return;
    try {
      const res = await fetch(`/api/notes/${editNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update');
      await fetchNotes();
      setEditNote(null);
      addToast('success', 'Note updated successfully!');
    } catch {
      addToast('error', 'Failed to update note');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${confirmDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchNotes();
      setConfirmDelete(null);
      addToast('success', 'Note deleted successfully!');
    } catch {
      addToast('error', 'Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const stats = {
    total: notes.length,
    high: notes.filter(n => n.priority === 'high').length,
    categories: new Set(notes.map(n => n.category)).size,
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">📝</div>
          <div>
            <div className="header-title">{appName}</div>
            <div className="header-subtitle">E-Commerce Note Management</div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditNote(null); setShowForm(true); }}
        >
          <span>＋</span> New Note
        </button>
      </header>

      {/* Main */}
      <main className="main-content">
        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Notes</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--danger)' }}>{stats.high}</span>
            <span className="stat-label">High Priority</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{stats.categories}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-bar">
          <div className="controls-left">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter
              category={categoryFilter}
              priority={priorityFilter}
              onCategoryChange={setCategoryFilter}
              onPriorityChange={setPriorityFilter}
            />
          </div>
        </div>

        {/* Notes List */}
        <NoteList
          notes={notes}
          loading={loading}
          onEdit={(note) => { setEditNote(note); setShowForm(true); }}
          onDelete={(note) => setConfirmDelete(note)}
        />
      </main>

      {/* Create/Edit Modal */}
      {showForm && (
        <NoteForm
          note={editNote}
          onSubmit={editNote ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditNote(null); }}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => !deleting && setConfirmDelete(null)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-header">
              <div className="confirm-icon">🗑️</div>
              <div className="confirm-title">Delete Note</div>
            </div>
            <div className="confirm-body">
              Are you sure you want to delete &ldquo;<strong>{confirmDelete.title}</strong>&rdquo;? This action cannot be undone.
            </div>
            <div className="confirm-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
