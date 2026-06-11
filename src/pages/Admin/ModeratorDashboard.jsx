import { useState, useEffect } from 'react';

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPodcasts, setPendingPodcasts] = useState([]);
  const [pendingVideos, setPendingVideos] = useState([]);

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollArticleId, setPollArticleId] = useState('');
  const [pollMessage, setPollMessage] = useState({ type: '', text: '' });
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, activeUsersRes, articlesRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/moderation/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/moderation/users/active`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/moderation/articles`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_URL}/categories`)
        ]);

        if (usersRes.ok) setPendingUsers(await usersRes.json());
        if (activeUsersRes.ok) setActiveUsers(await activeUsersRes.json());
        if (articlesRes.ok) setPendingArticles(await articlesRes.json());
        if (categoriesRes.ok) setCategories(await categoriesRes.json());
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        setIsLoading(false);
        const podcastsRes = await fetch(`${API_URL}/podcasts/pending`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (podcastsRes.ok) setPendingPodcasts(await podcastsRes.json());

        const videosRes = await fetch(`${API_URL}/videos/pending`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (videosRes.ok) setPendingVideos(await videosRes.json());
      }
    };

    fetchData();
  }, [API_URL, token]);

  const handleApproveUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/moderation/users/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const approvedUser = pendingUsers.find(u => u.id === id);
        setPendingUsers(pendingUsers.filter(u => u.id !== id));
        if (approvedUser) setActiveUsers([...activeUsers, { ...approvedUser, isApproved: true }]);
      }
    } catch (error) { console.error(error); }
  };

  const handleBlockUser = async (id) => {
    if (!window.confirm("Заблокувати цього користувача?")) return;
    try {
      const response = await fetch(`${API_URL}/moderation/users/${id}/block`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setActiveUsers(activeUsers.filter(u => u.id !== id));
      } else {
        alert('Помилка при блокуванні.');
      }
    } catch (error) { console.error(error); }
  };

  const handleApproveArticle = async (id) => {
    try {
      const response = await fetch(`${API_URL}/moderation/articles/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requiresSubscription: false })
      });

      if (response.ok) {
        setPendingArticles(pendingArticles.filter(a => a.id !== id));
      } else {
        alert('Помилка при схваленні статті');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addOptionField = () => setPollOptions([...pollOptions, '']);
  const removeOptionField = (index) => {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    setIsCreatingPoll(true);
    const validOptions = pollOptions.filter(opt => opt.trim() !== '');

    if (validOptions.length < 2) {
      setPollMessage({ type: 'error', text: 'Мінімум 2 варіанти відповідей.' });
      setIsCreatingPoll(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          question: pollQuestion,
          articleId: pollArticleId ? parseInt(pollArticleId) : null,
          options: validOptions
        })
      });

      if (response.ok) {
        setPollMessage({ type: 'success', text: 'Опитування розміщено!' });
        setPollQuestion(''); setPollOptions(['', '']); setPollArticleId('');
      }
    } catch (error) {
      setPollMessage({ type: 'error', text: 'Помилка сервера' });
    } finally {
      setIsCreatingPoll(false);
      setTimeout(() => setPollMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      if (response.ok) {
        setNewCategoryName('');
        const res = await fetch(`${API_URL}/categories`);
        if (res.ok) setCategories(await res.json());
      } else {
        alert('Помилка додавання рубрики');
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Видалити цю рубрику? Вона зникне з меню сайту.")) return;
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        alert('Помилка видалення рубрики');
      }
    } catch (error) { console.error(error); }
  };

  const handleApprovePodcast = async (id) => {
    try {
      const response = await fetch(`${API_URL}/podcasts/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setPendingPodcasts(pendingPodcasts.filter(p => p.id !== id));
    } catch (error) { console.error(error); }
  };

  const handleApproveVideo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/videos/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setPendingVideos(pendingVideos.filter(v => v.id !== id));
      }
    } catch (error) { console.error("Помилка схвалення:", error); }
  };

  const handleRejectVideo = async (id) => {
    if (!window.confirm("Відхилити та видалити це відео?")) return;
    try {
      const response = await fetch(`${API_URL}/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setPendingVideos(pendingVideos.filter(v => v.id !== id));
      }
    } catch (error) { console.error("Помилка видалення:", error); }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Кабінет Модератора</h1>

      <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200">
        <button onClick={() => setActiveTab('users')} className={`pb-4 px-2 font-bold text-sm ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Користувачі ({pendingUsers.length > 0 ? `+${pendingUsers.length}` : '0'})
        </button>
        <button onClick={() => setActiveTab('articles')} className={`pb-4 px-2 font-bold text-sm ${activeTab === 'articles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Статті на модерації ({pendingArticles.length})
        </button>
        <button onClick={() => setActiveTab('polls')} className={`pb-4 px-2 font-bold text-sm ${activeTab === 'polls' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Опитування
        </button>
        <button onClick={() => setActiveTab('categories')} className={`pb-4 px-2 font-bold text-sm ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Рубрики сайту
        </button>
        <button onClick={() => setActiveTab('podcasts')} className={`pb-4 px-2 font-bold text-sm ${activeTab === 'podcasts' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Подкасти ({pendingPodcasts.length})
        </button>
        <button onClick={() => setActiveTab('videos')} className={`pb-4 px-2 font-bold text-sm ${activeTab === 'videos' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Відео ({pendingVideos.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        {activeTab === 'users' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Очікують активації</h2>
              {isLoading ? <p>Завантаження...</p> : pendingUsers.length === 0 ? <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">Немає нових заявок.</p> : (
                <div className="space-y-3">
                  {pendingUsers.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-4 border border-amber-200 rounded-xl bg-amber-50">
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email} • Бажана роль: <span className="font-bold text-blue-600">{user.requestedRole}</span></p>
                      </div>
                      <button onClick={() => handleApproveUser(user.id)} className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700">Схвалити</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pt-8 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Активні користувачі (Блокування)</h2>
              {isLoading ? <p>Завантаження...</p> : activeUsers.length === 0 ? <p className="text-gray-500 text-sm">Користувачів немає.</p> : (
                <div className="space-y-3">
                  {activeUsers.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email} • Роль: {user.role}</p>
                      </div>
                      <button onClick={() => handleBlockUser(user.id)} className="text-red-600 bg-red-50 px-5 py-2.5 rounded-lg text-sm font-bold">Заблокувати</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Матеріали на перевірці</h2>
            {isLoading ? <p>Завантаження...</p> : pendingArticles.length === 0 ? <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">Усі статті перевірено.</p> : (
              <div className="space-y-4">
                {pendingArticles.map(article => (
                  <div key={article.id} className="flex justify-between items-center p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-500">Автор: <span className="font-medium text-gray-700">{article.author}</span> • Рубрика: <span className="font-medium text-blue-600">{article.category}</span></p>
                    </div>
                    <button onClick={() => handleApproveArticle(article.id)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">Опублікувати</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'podcasts' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Подкасти на перевірці</h2>
            {isLoading ? <p>Завантаження...</p> : pendingPodcasts.length === 0 ? <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">Усі подкасти перевірено.</p> : (
              <div className="space-y-4">
                {pendingPodcasts.map(podcast => (
                  <div key={podcast.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-5 border border-purple-200 rounded-xl bg-purple-50 shadow-sm">
                    <div className="flex-1 w-full">
                      <h3 className="font-bold text-purple-900 text-lg mb-1">🎧 {podcast.title}</h3>
                      <p className="text-sm text-purple-700 mb-3">Автор: {podcast.author} • Рубрика: {podcast.category}</p>
                      <audio controls className="w-full h-10">
                        <source src={podcast.audioUrl} type="audio/mpeg" />
                        Ваш браузер не підтримує аудіо.
                      </audio>
                    </div>
                    <button onClick={() => handleApprovePodcast(podcast.id)} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 w-full sm:w-auto mt-2 sm:mt-0 whitespace-nowrap">
                      Схвалити подкаст
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Відео на перевірці</h2>
            {isLoading ? <p>Завантаження...</p> : pendingVideos.length === 0 ? <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">Усі відео перевірено.</p> : (
              <div className="space-y-4">
                {pendingVideos.map(video => (
                  <div key={video.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-5 border border-red-200 rounded-xl bg-red-50 shadow-sm">
                    <div className="flex-1 w-full">
                      <h3 className="font-bold text-red-900 text-lg mb-1">🎬 {video.title}</h3>
                      <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-sm text-red-700 hover:underline mb-2 block">
                        {video.videoUrl}
                      </a>
                      <p className="text-xs text-red-600">Додано: {new Date(video.dateAdded).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button onClick={() => handleApproveVideo(video.id)} className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 w-full sm:w-auto">
                        Схвалити
                      </button>
                      <button onClick={() => handleRejectVideo(video.id)} className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 w-full sm:w-auto">
                        Відхилити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Створити нове опитування</h2>
            {pollMessage.text && <div className="p-4 mb-6 rounded-xl border text-sm font-medium bg-blue-50 text-blue-800 border-blue-200">{pollMessage.text}</div>}
            <form onSubmit={handleCreatePoll} className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Питання *</label>
                <input type="text" required value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none" placeholder="Наприклад: Як ви оцінюєте транспорт?" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ID статті (необов'язково)</label>
                <input type="number" value={pollArticleId} onChange={(e) => setPollArticleId(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none" placeholder="Залиште порожнім для глобального показу" />
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <label className="block text-sm font-bold text-gray-700">Варіанти відповідей *</label>
                {pollOptions.map((opt, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input type="text" value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-xl outline-none" placeholder={`Варіант ${index + 1}`} />
                    {pollOptions.length > 2 && <button type="button" onClick={() => removeOptionField(index)} className="text-red-500 font-bold p-2 bg-red-50 rounded-lg">✕</button>}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOptionField} className="text-sm font-bold text-blue-600 hover:text-blue-800">+ Додати варіант</button>
              <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
                <button type="submit" disabled={isCreatingPoll} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700">{isCreatingPoll ? 'Створення...' : 'Запустити'}</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Керування рубриками сайту</h2>
            <p className="text-sm text-gray-500 mb-6">Ці рубрики будуть відображатися в меню на головній сторінці та при створенні статей.</p>

            <div className="flex gap-2 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Назва нової рубрики (напр. 'Екологія')"
              />
              <button
                onClick={handleAddCategory}
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                Додати
              </button>
            </div>

            {isLoading ? <p>Завантаження рубрик...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors">
                    <span className="font-bold text-gray-700">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-500 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      title="Видалити рубрику"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ModeratorDashboard;
