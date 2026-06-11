import { useState, useEffect } from 'react';
import AdsManager from './AdsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const availableRoles = ['Зареєстрований', 'Запрошений автор', 'Журналіст', 'Модератор', 'Адміністратор', 'Заблокований'];

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsersList(data);
      } else {
        throw new Error('Не вдалося завантажити користувачів');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem('token');
    setSuccessMessage('');
    setError(null);

    try {
      const response = await fetch(`${API_URL}/admin/users/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        setSuccessMessage('Права користувача успішно оновлено!');
        setUsersList(usersList.map(u =>
          u.id === id ? { ...u, isApproved: true, role: newRole } : u
        ));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Помилка при зміні ролі на сервері');
      }
    } catch (error) {
      console.error(error);
      alert('Помилка з\'єднання з сервером');
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-500">Завантаження панелі керування...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-brand-dark mb-6">Панель Адміністратора</h1>

      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 font-bold transition-colors ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          👥 Керування користувачами
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`pb-3 px-4 font-bold transition-colors ${activeTab === 'ads' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'
            }`}
        >
          📢 Рекламні банери
        </button>
      </div>

      {successMessage && (
        <div className="p-4 mb-6 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
          ✅ {successMessage}
        </div>
      )}


      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Керування користувачами та ролями</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="p-4 font-semibold">Ім'я</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Статус</th>
                  <th className="p-4 font-semibold">Роль (Керування)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{u.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{u.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold ${u.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {u.isApproved ? 'Активний' : 'Очікує модерації'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="p-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-xs text-gray-800"
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {usersList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Користувачів поки немає
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="animate-fadeIn">
          <AdsManager />
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
