import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import { useAuth } from '../../hooks/useAuth';

const CommentList = ({ articleId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_URL}/comments/article/${articleId}`);
        if (response.ok) {
          setComments(await response.json());
        }
      } catch (error) {
        console.error("Помилка завантаження коментарів:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) fetchComments();
  }, [articleId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ articleId: parseInt(articleId), text: newComment })
      });

      if (response.ok) {
        const createdComment = await response.json();
        setComments([createdComment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      alert('Помилка відправки коментаря');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви дійсно хочете видалити цей коментар?")) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setComments(comments.filter(c => c.id !== id));
      } else {
        alert('Помилка при видаленні');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id, updatedText) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: updatedText })
      });

      if (response.ok) {
        setComments(comments.map(c => c.id === id ? { ...c, text: updatedText } : c));
      } else {
        alert('Помилка при збереженні змін');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Коментарі ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишіть свою думку щодо цього матеріалу..."
            className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm text-gray-800 bg-gray-50 focus:bg-white transition-all"
            rows="3"
            required
          />
          <div className="flex justify-end mt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
              Відправити
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-2xl text-center mb-8 border border-gray-200">
          <p className="text-gray-600 text-sm mb-4">Тільки зареєстровані користувачі можуть залишати коментарі.</p>
          <a href="/login" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
            Увійти до акаунту
          </a>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4 text-gray-400 text-sm animate-pulse">Завантаження обговорення...</div>
      ) : (
        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              id={comment.id}
              author={comment.author}
              text={comment.text}
              date={new Date(comment.date).toLocaleDateString('uk-UA', {
                hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long'
              })}
              currentUser={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Поки що жодного коментаря немає.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentList;
