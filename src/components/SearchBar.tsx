'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search notes by title or content..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          type="button"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
