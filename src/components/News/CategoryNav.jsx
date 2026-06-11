import { useState, useEffect } from 'react';

const CategoryNav = ({ activeCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  if (isLoading) {
    return <div className="text-gray-400 text-sm animate-pulse py-2">Завантаження рубрик...</div>;
  }

  return (
    <nav className="flex space-x-2 overflow-x-auto pb-3 border-b border-gray-100 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.name)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${activeCategory === cat.name
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
};

export default CategoryNav;
