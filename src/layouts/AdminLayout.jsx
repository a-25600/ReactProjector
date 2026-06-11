import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans">

            <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen flex flex-col shrink-0 sticky top-0 md:h-screen z-10">

                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link to="/" className="text-xl font-black text-blue-600 tracking-tighter hover:opacity-80 transition-opacity">
                        PROJECTOR<span className="text-gray-900">.work</span>
                    </Link>
                </div>

                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-gray-900 truncate">{user?.name || 'Користувач'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <span className="inline-block mt-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                        {user?.role || 'Роль не визначена'}
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2">
                    Панелі управління
                  </p>

                  {user?.role === 'Адміністратор' && (
                    <NavLink to="/admin" className={navLinkStyle}>
                      <span className="text-lg">⚙️</span> Адміністратор
                    </NavLink>
                  )}

                  {(user?.role === 'Адміністратор' || user?.role === 'Модератор') && (
                    <NavLink to="/moderator" className={navLinkStyle}>
                      <span className="text-lg">🛡️</span> Модерація
                    </NavLink>
                  )}

                  {(user?.role === 'Адміністратор' || user?.role === 'Модератор' || user?.role === 'Журналіст') && (
                    <NavLink to="/journalist-workspace" className={navLinkStyle}>
                      <span className="text-lg">✍️</span> Журналіст
                    </NavLink>
                  )}

                  {user?.role === 'Запрошений autor' || user?.role === 'Запрошений автор' ? (
                    <NavLink to="/author-workspace" className={navLinkStyle}>
                      <span className="text-lg">💡</span> Блогер
                    </NavLink>
                  ) : null}
                </nav>

                <div className="p-4 border-t border-gray-200 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                        <span>🏠</span> На головну сайту
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <span>🚪</span> Вийти
                    </button>
                </div>
            </aside>

            <main className="flex-1 bg-gray-50 min-h-screen overflow-x-hidden">
                <div className="p-4 md:p-8">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;
