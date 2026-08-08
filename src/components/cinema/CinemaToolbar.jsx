import React from "react";

export default function CinemaToolbar({
  filterOptions,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onClearSearch,
}) {
  return (
    <div className="cinema-toolbar">
      <div className="cinema-filter-buttons">
        {filterOptions.map((option) => (
          <button
            type="button"
            key={option}
            className={
              activeFilter === option
                ? "cinema-filter-button is-active"
                : "cinema-filter-button"
            }
            onClick={() => onFilterChange(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <label className="cinema-search">
        <span className="cinema-search-icon" aria-hidden="true">
          ⌕
        </span>

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search the cinema"
          aria-label="Search The Aset Cinema"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear cinema search"
          >
            ×
          </button>
        )}
      </label>
    </div>
  );
}
