import { useState, useEffect } from 'react';

const AdsManager = () => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/ads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setAds(await response.json());
      }
    } catch (error) {
      console.error("Помилка завантаження реклами:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [API_URL, token]);

  const handleCreateAd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyName, imageUrl, targetUrl, isActive: true })
      });

      if (response.ok) {
        setCompanyName('');
        setImageUrl('');
        setTargetUrl('');
        fetchAds();
      }
    } catch (error) {
      console.error("Помилка створення банера:", error);
    }
  };

  const handleToggleAd = async (id) => {
    try {
      const response = await fetch(`${API_URL}/ads/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchAds();
    } catch (error) { console.error(error); }
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm("Ви дійсно хочете назавжди видалити цей банер?")) return;

    try {
      const response = await fetch(`${API_URL}/ads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchAds();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Додати новий банер</h3>
        <form onSubmit={handleCreateAd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Рекламодавець</label>
            <input
              required value={companyName} onChange={e => setCompanyName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="Наприклад: Rozetka"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Посилання на картинку</label>
            <input
              required type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Цільове посилання (куди перейде)</label>
            <input
              required type="url" value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="https://..."
            />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition">
              + Додати банер
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Керування банерами</h3>
        {isLoading ? <p>Завантаження...</p> : ads.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">Немає жодного банера.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map(ad => (
              <div key={ad.id} className={`flex flex-col border rounded-xl overflow-hidden shadow-sm ${ad.isActive ? 'border-blue-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-75'}`}>
                <div className="h-32 bg-gray-100 relative">
                  <img src={ad.imageUrl} alt={ad.companyName} className="w-full h-full object-cover" />
                  {!ad.isActive && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-lg">Вимкнено</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900">{ad.companyName}</h4>
                    <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline break-all">
                      {ad.targetUrl}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAd(ad.id)}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${ad.isActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {ad.isActive ? 'Вимкнути' : 'Увімкнути'}
                    </button>
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="px-4 py-2 bg-red-100 text-red-600 text-sm font-bold rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsManager;
