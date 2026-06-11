import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PollWidget from '../../components/Widgets/PollWidget';
import CommentList from '../../components/Comments/CommentList';
import { useAuth } from '../../hooks/useAuth';
import TagCloud from '../../components/News/TagCloud';
import AISummary from '../../components/AI/AISummary';
import AudioReader from '../../components/AI/AudioReader';

const Article = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', previewText: '', fullText: '', imageUrl: '', requiresSubscription: false });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const isAdmin = user?.role === 'Адміністратор';
  const isModerator = user?.role === 'Модератор';
  const canEdit = isAdmin || isModerator;
  const canDelete = isAdmin;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_URL}/news/${id}`, { headers });
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
          setEditData({
            title: data.title,
            previewText: data.previewText,
            fullText: data.fullText || '',
            imageUrl: data.imageUrl || '',
            requiresSubscription: data.requiresSubscription || false
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id, API_URL]);

  const handleSubscribe = async () => {
    if (!user) { navigate('/register'); return; }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/subscribe`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Підписку успішно активовано!');
        window.location.reload();
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Видалити цю статтю назавжди?")) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) navigate('/');
    } catch (error) { console.error(error); }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        setArticle({ ...article, ...editData });
        setIsEditing(false);
      }
    } catch (error) { console.error(error); }
  };
  const tagsArray = (article?.tags || article?.Tags)
    ? (article.tags || article.Tags).split(',').map(t => t.trim()).filter(t => t.length > 0)
    : [];
  if (isLoading) return <div className="text-center py-20 text-gray-500">Завантаження...</div>;
  if (!article) return <div className="text-center py-20 text-red-500">Статтю не знайдено</div>;

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      {canEdit && !isEditing && (
        <div className="flex gap-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="mr-auto font-bold text-gray-600 flex items-center">🛡️ Керування матеріалом</span>
          <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700">Редагувати</button>
          {canDelete && <button onClick={handleDelete} className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-red-600">Видалити</button>}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 space-y-4">
          <h3 className="font-bold text-lg mb-4">Редагування матеріалу</h3>
          <input className="w-full p-3 border rounded-xl" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} placeholder="Заголовок" />
          <input className="w-full p-3 border rounded-xl" value={editData.imageUrl} onChange={e => setEditData({ ...editData, imageUrl: e.target.value })} placeholder="URL картинки" />
          <textarea className="w-full p-3 border rounded-xl" value={editData.previewText} onChange={e => setEditData({ ...editData, previewText: e.target.value })} placeholder="Лід" rows="2" />
          <textarea className="w-full p-3 border rounded-xl" value={editData.fullText} onChange={e => setEditData({ ...editData, fullText: e.target.value })} placeholder="Текст" rows="10" />
          <label className="flex items-center gap-2 mt-4 cursor-pointer p-3 bg-amber-50 rounded-xl border border-amber-200 w-fit">
            <input type="checkbox" checked={editData.requiresSubscription} onChange={e => setEditData({ ...editData, requiresSubscription: e.target.checked })} className="w-5 h-5 text-amber-600 rounded" />
            <span className="font-bold text-amber-800">Стаття за підпискою (Premium)</span>
          </label>
          <div className="flex gap-3 pt-4">
            <button onClick={handleSaveEdit} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold">Зберегти зміни</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-bold">Скасувати</button>
          </div>
        </div>
      ) : (
        <>
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-gray-500 font-medium">
              <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                ✍️ Автор: <span className="font-bold text-gray-900">{article.author || 'Редакція'}</span>
              </div>
              <span>•</span>
              <span>{new Date(article.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              {article.category && (
                <>
                  <span>•</span>
                  <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg">{article.category}</span>
                </>
              )}
            </div>

            <p className="text-xl text-gray-600 font-medium italic">{article.previewText}</p>
          </header>

          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="w-full rounded-2xl mb-8 object-cover max-h-[500px]" />
          )}

          {article.fullText && !article.requiresSubscription && (
            <div className="mb-8">
              <AudioReader textToRead={`${article.title}. ${article.fullText}`} />

              <AISummary articleText={article.fullText} />
            </div>
          )}

          {article.requiresSubscription && !article.fullText ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 rounded-3xl text-center border border-amber-200 mb-12 shadow-sm">
              <span className="text-5xl block mb-4">👑</span>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Ексклюзивний матеріал</h3>
              <p className="text-gray-700 mb-8 max-w-lg mx-auto leading-relaxed">
                Ця стаття доступна лише для читачів із преміум-підпискою. Оформте підписку, щоб отримати доступ до найкращої аналітики.
              </p>
              <button onClick={handleSubscribe} className="bg-amber-500 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md">
                {user ? 'Активувати підписку' : 'Зареєструватись для доступу'}
              </button>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none text-gray-800 whitespace-pre-wrap mb-12">
              {article.fullText}
            </div>
          )}

            {tagsArray.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Теги матеріалу:</h3>
                <TagCloud
                  tags={tagsArray}
                  onTagClick={(tag) => {
                    navigate(`/?tag=${encodeURIComponent(tag)}`);
                  }}
                />
              </div>
            )}
        </>
      )}
      

      <PollWidget articleId={id} />
      <CommentList articleId={id} />
    </article>
  );
};

export default Article;
