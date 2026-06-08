import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    const menuItems = [
        { name: 'Головна', path: '/' },
        { name: 'Актуальні новини', path: '/category/actual' },
        { name: 'Економіка', path: '/category/economy' },
        { name: 'Технології', path: '/category/tech' },
        { name: 'Спорт', path: '/category/sports' },
        { name: 'Блоги', path: '/blogs' },
        { name: 'Подкасти', path: '/podcasts' },
        { name: 'Відео', path: '/video' },
        { name: 'Форум', path: '/forum' },
    ];

    return (
        <nav className="bg-gray-100 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <ul className="flex max-w-7xl mx-auto px-4 space-x-6 whitespace-nowrap py-3">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors hover:text-blue-600 ${isActive
                                    ? 'text-blue-700 border-b-2 border-blue-700 pb-[13px]'
                                    : 'text-gray-700'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;