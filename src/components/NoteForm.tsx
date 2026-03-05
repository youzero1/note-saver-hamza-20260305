'use client';

import { useState, useEffect } from 'react';
import { NoteData, CreateNoteDto, NoteCategory, NotePriority } from '../types';

interface NoteFormProps {
  note?: NoteData | null;
  onSubmit: (data: CreateNoteDto) => Promise<void>;
  onClose: () => void;
}

const CATEGORIES: { value: NoteCategory; label: string; emoji: string }[] = [
  { value: 'product', label: 'Product', emoji: '📦' },
  { value: 'supplier', label: 'Supplier', emoji: '🏭' },
  { value: 'order', label: 'Order', emoji: '🛒' },
  { value: 'inventory', label: 'Inventory', emoji: '📊' },
  { value: 'pricing', label: 'Pricing', emoji: '💰' },
  { value: 'general', label: 'General', emoji: '📝' },
];

const PRIORITIES: { value: NotePriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
];

export default function NoteForm({ note, onSubmit, onClose }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState<NoteCategory>(note?.category as NoteCategory || 'general');
  const [priority, setPriority] = useState<NotePriority>(note?.priority as NotePriority || 'medium');
  const [tags, setTags] = useState(note?.tags || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!content.trim()) errs.content = 'Content is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), category, priority, tags: tags.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{note ? 'Edit Note' : 'Create New Note'}</h2>
          <button className="modal-close" onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label required">Title</label>
              <input
                type="text"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter note title..."
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })); }}
                maxLength={255}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Content */}
            <div className="form-group">
              <label className="form-label required">Content</label>
              <textarea
                className={`form-input form-textarea ${errors.content ? 'error' : ''}`}
                placeholder="Write your note content here..."
                value={content}
                onChange={e => { setContent(e.target.value); setErrors(prev => ({ ...prev, content: '' })); }}
              />
              {errors.content && <span className="form-error">{errors.content}</span>}
            </div>

            {/* Category & Priority */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input filter-select"
                  value={category}
                  onChange={e => setCategory(e.target.value as NoteCategory)}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input filter-select"
                  value={priority}
                  onChange={e => setPriority(e.target.value as NotePriority)}
                >
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. amazon, q4, electronics (comma separated)"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
              <span className="form-hint">Separate multiple tags with commas</span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
