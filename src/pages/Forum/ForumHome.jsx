import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const ForumHome = () => {
  const { canUseForum } = usePermissions();
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTopics();
  }, [API_URL]);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/forum/topics`);
      if (response.ok) setTopics(await response.json());
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/forum/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newThreadTitle })
      });
      if (response.ok) {
        setIsModalOpen(false);
        setNewThreadTitle('');
        fetchTopics();
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div className="border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Міський Форум</h1>
          <p className="text-sm text-gray-500 mt-1">Простір для обговорень.</p>
        </div>
        {canUseForum && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            + Створити тему
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateThread} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Створення нової теми</h2>
            <input
              value={newThreadTitle}
              onChange={e => setNewThreadTitle(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4"
              placeholder="Назва теми..."
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Скасувати</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Створити</button>
            </div>
          </form>
        </div>
      )}

      {!canUseForum ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center">
          <p className="text-amber-800 font-medium">Форум доступний лише для авторизованих.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? <div className="p-10 text-center">Завантаження...</div> : (
            <div className="divide-y divide-gray-100">
              {topics.map(topic => (
                <div key={topic.id} className="p-4 flex justify-between items-center">
                  <Link to={`/forum/${topic.id}`} className="font-semibold text-gray-900 hover:text-blue-600">{topic.title}</Link>
                  <span className="text-sm text-gray-500">{topic.replies} відповідей</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ForumHome;
