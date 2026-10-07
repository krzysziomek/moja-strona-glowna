import React from 'react';
import { Search, X } from 'lucide-react';

export default function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  searchQuery,
  onSearchChange
}) {
  return (
    <div className="filter-bar" id="explore">
      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSelectCategory('all')}
        >
          <span>Wszystkie</span>
          <span className="category-count">{categoryCounts['all'] || 0}</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            <span>{cat}</span>
            <span className="category-count">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </div>

      <div className="filter-search-box">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Szukaj kolekcji, np. 2025, Zoo..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
