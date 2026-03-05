'use client';

import { NoteData } from '../types';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: NoteData[];
  loading: boolean;
  onEdit: (note: NoteData) => void;
  onDelete: (note: NoteData) => void;
}

export default function NoteList({ notes, loading, onEdit, onDelete }: NoteListProps) {
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No notes found</h3>
          <p>Create your first note to get started with organizing your e-commerce information.</p>
        </div>
      ) : (
        notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
