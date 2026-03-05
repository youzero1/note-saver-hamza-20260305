'use client';

import { NoteData } from '../types';

interface NoteCardProps {
  note: NoteData;
  onEdit: (note: NoteData) => void;
  onDelete: (note: NoteData) => void;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  product: 'Product',
  supplier: 'Supplier',
  order: 'Order',
  inventory: 'Inventory',
  pricing: 'Pricing',
  general: 'General',
};

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div className="note-card">
      <div className={`note-card-priority-bar ${note.priority}`} />

      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <div className="note-card-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onEdit(note)}
            title="Edit note"
          >
            ✏️
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onDelete(note)}
            title="Delete note"
            style={{ color: 'var(--danger)' }}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="note-card-meta">
        <span className={`badge badge-${note.category}`}>
          {CATEGORY_LABELS[note.category] || note.category}
        </span>
        <span className={`priority-badge ${note.priority}`}>
          <span className={`priority-dot ${note.priority}`} />
          {note.priority}
        </span>
      </div>

      <p className="note-card-content">{note.content}</p>

      {tags.length > 0 && (
        <div className="note-card-tags">
          {tags.slice(0, 5).map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
          {tags.length > 5 && (
            <span className="tag">+{tags.length - 5} more</span>
          )}
        </div>
      )}

      <div className="note-card-footer">
        <span className="note-timestamp">Updated {formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
}
