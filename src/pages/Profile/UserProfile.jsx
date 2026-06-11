import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = () => {
  const { user } = useAuth();

  const [setHasSubscription] = useState(false);
  const [setEmailNotifications] = useState(true);
  const [setSmartBandMode] = useState(false);

  const [profileData, setProfileData] = useState({ name: '', email: '', avatarUrl: '' });

  const [setIsLoadingProfile] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/users/me`, { headers: { 'Authorization': `Bearer ${token}` } });

        if (response.ok) {
          const data = await response.json();
          setHasSubscription(data.hasSubscription);
          setEmailNotifications(data.emailNotifications ?? true);
          setSmartBandMode(data.smartBandMode ?? false);
          setProfileData({ name: data.name || '', email: data.email || '', avatarUrl: data.avatarUrl || '' });
        }
      } catch (error) { console.error(error); } finally { setIsLoadingProfile(false); }
    };

    if (user) fetchProfileData();
  }, [user, API_URL]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setMessage({ text: 'Профіль оновлено! Якщо ви змінили пошту, заново увійдіть в акаунт.', type: 'success' });
      } else {
        setMessage({ text: 'Помилка оновлення профілю', type: 'error' });
      }
    } catch (error) { setMessage({ text: 'Помилка сервера', type: 'error' }); }
  };

  if (!user) return <div className="text-center py-20 text-gray-500">Авторизуйтесь.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Особистий кабінет</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl font-medium text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">

        <div className="mb-10 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">👤 Ваші дані</h3>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
              {profileData.avatarUrl ? (
                <img src={profileData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-gray-400">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ваше ім'я</label>
                  <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full p-3 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL Аватарки (опціонально)</label>
                <input type="text" value={profileData.avatarUrl} onChange={e => setProfileData({ ...profileData, avatarUrl: e.target.value })} placeholder="https://example.com/avatar.jpg" className="w-full p-3 border rounded-xl" />
              </div>
              <button onClick={handleSaveProfile} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-blue-700">
                Оновити профіль
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
