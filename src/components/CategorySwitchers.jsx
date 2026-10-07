import React from 'react';

const CATEGORIES = [
  { id: 'Przyrodnicze', name: 'Przyrodnicze', img: 'img/rosliny.webp' },
  { id: 'Wydarzenia', name: 'Wydarzenia', img: 'img/ludzie.webp' },
  { id: 'Inne', name: 'Inne', img: 'img/inne.webp' }
];

export default function CategorySwitchers({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-switchers">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <div
            key={cat.id}
            className={`cat-switch-card ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <img 
              src={cat.img} 
              alt={cat.name} 
              className="cat-switch-img"
            />
            <div className="cat-switch-body">
              <div className="cat-switch-name">{cat.name}</div>
              <button className="cat-switch-btn">
                {isActive ? 'Wybrane' : 'Przejdź'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
