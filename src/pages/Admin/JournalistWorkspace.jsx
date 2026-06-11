import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

const JournalistWorkspace = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('article');

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [previewText, setPreviewText] = useState('');
  const [fullText, setFullText] = useState('');
  const [tags, setTags] = useState('');

  const [audioUrl, setAudioUrl] = useState('');
  const [description, setDescription] = useState('');

  const [videoUrl, setVideoUrl] = useState('');

  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        if (data.length > 0) setCategory(data[0].name);
      });
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      let endpoint = '';
      let bodyData = {};

      if (activeTab === 'article') {
        endpoint = `${API_URL}/news`;
        bodyData = { title, category, previewText, fullText, imageUrl: imageUrl || null, tags };
      } else if (activeTab === 'podcast') {
        endpoint = `${API_URL}/podcasts`;
        bodyData = { title, category, description, audioUrl, imageUrl: imageUrl || null };
      } else if (activeTab === 'video') {
        endpoint = `${API_URL}/videos`;
        bodyData = { title, videoUrl };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) throw new Error('Не вдалося зберегти матеріал');

      setStatus('success');
      setMessage(`Матеріал "${title}" успішно додано!`);

      setTitle(''); setImageUrl(''); setTags('');
      setPreviewText(''); setFullText('');
      setAudioUrl(''); setDescription('');
      setVideoUrl('');
      if (categories.length > 0) setCategory(categories[0].name);

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  let btnColorClass = 'bg-blue-600 hover:bg-blue-700';
  if (activeTab === 'podcast') btnColorClass = 'bg-purple-600 hover:bg-purple-700';
  if (activeTab === 'video') btnColorClass = 'bg-red-600 hover:bg-red-700';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Кабінет Журналіста</h1>
      <p className="text-gray-500 mb-8">Створення нового матеріалу. Після збереження він буде відправлений модератору.</p>

      <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('article')}
          className={`pb-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === 'article' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          ✍️ Написати статтю
        </button>
        <button
          onClick={() => setActiveTab('podcast')}
          className={`pb-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === 'podcast' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🎧 Додати подкаст
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`pb-3 px-4 font-bold whitespace-nowrap transition-colors ${activeTab === 'video' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-800'}`}
        >
          🎬 Додати відео
        </button>
      </div>

      {status === 'success' && <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-200">{message}</div>}
      {status === 'error' && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {activeTab === 'video' ? 'Назва відео *' : 'Назва матеріалу *'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
            placeholder="Введіть заголовок..."
          />
        </div>

        {activeTab !== 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Рубрика *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none">
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Обкладинка (URL)</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none" placeholder="https://example.com/image.jpg" />
            </div>
          </div>
        )}

        {activeTab === 'article' && (
          <>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Теги (через кому)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-3 border border-gray-300 rounded-xl outline-none" placeholder="політика, київ, фінанси" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Короткий опис (Лід) *</label>
              <textarea value={previewText} onChange={(e) => setPreviewText(e.target.value)} required rows="2" className="w-full p-3 border border-gray-300 rounded-xl outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Повний текст статті *</label>
              <textarea value={fullText} onChange={(e) => setFullText(e.target.value)} required rows="10" className="w-full p-3 border border-gray-300 rounded-xl outline-none" />
            </div>
          </>
        )}

        {activeTab === 'podcast' && (
          <>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-purple-700">URL аудіофайлу (mp3) *</label>
              <input type="url" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://example.com/audio.mp3" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-purple-700">Опис подкасту *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" placeholder="Про що цей випуск? Хто гості?" />
            </div>
          </>
        )}

        {activeTab === 'video' && (
          <>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 text-red-700">Посилання на YouTube *</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Можна вставляти повні посилання, короткі (youtu.be) або просто ID відео.
              </p>
            </div>
          </>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-70 text-sm ${btnColorClass}`}
          >
            {status === 'loading' ? 'Відправка...' : activeTab === 'video' ? 'Опублікувати відео' : 'Відправити на модерацію'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalistWorkspace;
