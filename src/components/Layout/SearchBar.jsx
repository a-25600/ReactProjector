import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearchSubmit }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center w-full relative group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук новин, рубрик, тегів..."
        className="w-full pl-12 pr-32 py-3.5 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-gray-50 focus:bg-white text-lg transition-all shadow-sm"
      />

      <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors">
        🔍
      </span>

      <button
        type="submit"
        className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-8 rounded-full hover:bg-blue-700 transition-colors text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-lg"
      >
        Знайти
      </button>
    </form>
  );
};

export default SearchBar;
