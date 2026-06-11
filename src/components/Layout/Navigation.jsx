import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = ({ isOpen, onClose, dynamicCategories = [] }) => {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const staticLinks = [
    { name: 'Блоги', path: '/blogs' },
    { name: 'Подкасти', path: '/podcasts' },
    { name: 'Відео', path: '/video' },
    { name: 'Форум', path: '/forum' },
  ];

  return (
    <>
      <div
        className="fixed inset-0 top-[65px] bg-black/40 z-30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute top-[65px] left-0 w-full bg-white shadow-2xl border-b border-gray-200 z-40 animate-fadeIn overflow-y-auto max-h-[calc(100vh-65px)]">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-10">

          <div className="flex-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Рубрики новин</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              <li>
                <NavLink to="/" onClick={onClose} className={({ isActive }) => `block text-lg font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
                  Головна сторінка
                </NavLink>
              </li>

              {dynamicCategories.map((cat) => (
                <li key={cat.id || cat.Id}>
                  <NavLink
                    to={`/category/${encodeURIComponent(cat.name || cat.Name)}`}
                    onClick={onClose}
                    className={({ isActive }) => `block text-lg font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-700 font-bold' : 'text-gray-700'}`}
                  >
                    {cat.name || cat.Name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-10 mb-6">Спецпроєкти</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {staticLinks.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `block text-lg font-medium transition-colors hover:text-purple-600 ${isActive ? 'text-purple-700 font-bold' : 'text-gray-700'}`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-72 flex flex-col gap-8 md:border-l md:border-gray-100 md:pl-10">

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Акаунт</h3>
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="border-b border-gray-100 pb-3 mb-1">
                    <span className="block text-gray-900 font-bold text-lg">{user.name}</span>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{user.role}</span>
                  </div>

                  <Link to="/profile" onClick={onClose} className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
                    Мій профіль
                  </Link>

                  {['Журналіст', 'Модератор', 'Адміністратор'].includes(user.role) && (
                    <Link to="/journalist-workspace" onClick={onClose} className="text-green-600 font-medium hover:underline">
                      Кабінет Журналіста
                    </Link>
                  )}

                  {['Запрошений автор', 'Адміністратор'].includes(user.role) && (
                    <Link to="/author-workspace" onClick={onClose} className="text-orange-600 font-medium hover:underline">
                      Кабінет Автора
                    </Link>
                  )}

                  {['Модератор', 'Адміністратор'].includes(user.role) && (
                    <Link to="/moderator" onClick={onClose} className="text-blue-600 font-medium hover:underline">
                      Кабінет Модератора
                    </Link>
                  )}

                  {user.role === 'Адміністратор' && (
                    <Link to="/admin" onClick={onClose} className="text-purple-600 font-bold hover:underline">
                      Панель Адміністратора
                    </Link>
                  )}

                  <button onClick={() => { logout(); onClose(); }} className="text-left font-bold text-red-500 hover:text-red-700 mt-2 pt-3 border-t border-gray-100 transition-colors">
                    Вийти з акаунту
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={onClose} className="block bg-blue-600 text-white text-center py-2 px-4 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  Увійти
                </Link>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ми в соцмережах</h3>
              <div className="flex gap-4">
                <a href="https://t.me/" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" alt="Telegram" className="w-8 h-8 object-contain" />
                </a>
                <a href="https://facebook.com/" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="w-8 h-8 object-contain" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
