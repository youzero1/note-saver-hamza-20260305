'use client';

import { NoteCategory, NotePriority } from '../types';

interface CategoryFilterProps {
  category: NoteCategory | '';
  priority: NotePriority | '';
  onCategoryChange: (value: NoteCategory | '') => void;
  onPriorityChange: (value: NotePriority | '') => void;
}

export default function CategoryFilter({
  category,
  priority,
  onCategoryChange,
  onPriorityChange,
}: CategoryFilterProps) {
  return (
    <>
      <select
        className="filter-select"
        value={category}
        onChange={e => onCategoryChange(e.target.value as NoteCategory | '')}
      >
        <option value="">All Categories</option>
        <option value="product">📦 Product</option>
        <option value="supplier">🏭 Supplier</option>
        <option value="order">🛒 Order</option>
        <option value="inventory">📊 Inventory</option>
        <option value="pricing">💰 Pricing</option>
        <option value="general">📝 General</option>
      </select>

      <select
        className="filter-select"
        value={priority}
        onChange={e => onPriorityChange(e.target.value as NotePriority | '')}
      >
        <option value="">All Priorities</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>
    </>
  );
}
