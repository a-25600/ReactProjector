import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-black text-blue-700 tracking-tighter">
                    PROЖЕКТОР
                </Link>

                <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
                    <Link to="/category/politics" className="hover:text-blue-600">Актуальні події</Link>
                    <Link to="/category/tech" className="hover:text-blue-600">Технології</Link>
                    <Link to="/blogs" className="hover:text-blue-600">Блоги</Link>
                    <Link to="/forum" className="hover:text-blue-600">Форум</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-gray-800">🔍</button>

                    {user ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">{user.name}</span>
                            <button className="text-sm text-red-500 hover:text-red-700">Вийти</button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
                            Увійти
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;