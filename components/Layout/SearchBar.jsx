import React, { useState } from 'react';
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
        <form onSubmit={handleSubmit} className="flex items-center w-full max-w-sm relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Пошук новин, авторів, тегів..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm transition-all"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
            </span>
            <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-4 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
            >
                Знайти
            </button>
        </form>
    );
};

export default SearchBar;