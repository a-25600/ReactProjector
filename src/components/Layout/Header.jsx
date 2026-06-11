import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from '../../components/Layout/SearchBar';
import Navigation from './Navigation';
import logoImg from '../../assets/projector.png';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [categories, setCategories] = useState([]);
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
        console.error("Помилка завантаження рубрик:", error);
      }
    };
    fetchCategories();
  }, [API_URL]);

  const toggleMenu = () => {
    if (isSearchOpen) setIsSearchOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    setIsSearchOpen(!isSearchOpen);
  };

  const headerCategories = categories.slice(0, 4);

  return (
    <div className="sticky top-0 z-50">

      <header className="bg-white border-b border-gray-200 relative z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3 h-[65px] gap-8">

          <Link to="/" className="shrink-0 block" onClick={() => setIsMenuOpen(false)}>
            <img
              src={logoImg}
              alt="Логотип сайту"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-6 font-medium text-gray-700">
            {headerCategories.map(cat => (
              <NavLink
                key={cat.id || cat.Id}
                to={`/category/${encodeURIComponent(cat.name || cat.Name)}`}
                className={({ isActive }) => `transition-colors hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : ''}`}
              >
                {cat.name || cat.Name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0 text-gray-700">

            <button
              onClick={toggleSearch}
              className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Пошук"
            >
              {isSearchOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleMenu}
              className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors ml-1"
              title="Меню"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="absolute top-[65px] left-0 w-full bg-white shadow-xl border-b border-gray-200 z-40 p-8 animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      )}

      <Navigation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        dynamicCategories={categories}
      />

    </div>
  );
};

export default Header;
