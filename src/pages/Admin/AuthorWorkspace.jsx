import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthorWorkspace = () => {
  const { user } = useAuth();
  const isAuthor = user?.role === 'Автор' || user?.role === 'Запрошений автор';

  const [title, setTitle] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [fullText, setFullText] = useState('');
  const [category, setCategory] = useState(isAuthor ? 'Блоги' : 'Актуальні події');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const categories = ['Актуальні події', 'Культура', 'Регіони', 'Шоубіз', 'Економіка', 'Технології'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, previewText, fullText, category, imageUrl: imageUrl || null })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Опубліковано!' });
        setTimeout(() => navigate(isAuthor ? '/blogs' : '/'), 2000);
      } else {
        setMessage({ type: 'error', text: 'Помилка публікації' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Помилка мережі' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black mb-8">Кабінет Автора</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200">
        <div>
          <label className="block font-bold">Заголовок *</label>
          <input required className="w-full p-3 border rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className={`grid grid-cols-1 gap-6 ${!isAuthor ? 'md:grid-cols-2' : ''}`}>
          {!isAuthor && (
            <div>
              <label className="block font-bold">Рубрика *</label>
              <select className="w-full p-3 border rounded-xl" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block font-bold">URL обкладинки</label>
            <input className="w-full p-3 border rounded-xl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block font-bold">Короткий опис *</label>
          <textarea required className="w-full p-3 border rounded-xl" value={previewText} onChange={(e) => setPreviewText(e.target.value)} />
        </div>

        <div>
          <label className="block font-bold">Повний текст *</label>
          <textarea required rows="10" className="w-full p-3 border rounded-xl" value={fullText} onChange={(e) => setFullText(e.target.value)} />
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl">
          {isSubmitting ? 'Публікація...' : 'Опублікувати'}
        </button>
      </form>
    </div>
  );
};

export default AuthorWorkspace;
