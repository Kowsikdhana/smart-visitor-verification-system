import React from 'react';

/**
 * SearchBar Component
 *
 * Bootstrap Classes Explained:
 * - input-group: Connects text inputs with buttons or icons into a single visual block (Docs: Forms -> Input group)
 * - form-control: Bootstrap standard responsive text input styling (Docs: Forms -> Form controls)
 * - btn-outline-secondary: Border-only button style that highlights on hover (Docs: Components -> Buttons)
 */
export default function SearchBar({ value, onChange, onClear, placeholder = 'Search...' }) {
  return (
    <div className="input-group">
      <span className="input-group-text bg-white text-secondary border-end-0">
        <i className="bi bi-search"></i>
      </span>
      <input
        type="text"
        className="form-control border-start-0 ps-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn btn-outline-secondary border-start-0"
          type="button"
          onClick={onClear}
          title="Clear search"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}
