import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const BlogList = () => {
  const { canWriteBlog } = usePermissions();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/news?category=Блоги`);
        if (!response.ok) throw new Error('Не вдалося завантажити блоги');

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error("Помилка:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Авторські Блоги</h1>
          <p className="text-sm text-gray-500 mt-1">Думки експертів, аналітика та суб'єктивні погляди на події.</p>
        </div>

        {canWriteBlog && (
          <Link
            to="/author-workspace"
            className="bg-blue-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            Написати статтю
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">Завантаження блогів...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-gray-500">Поки що немає опублікованих блогів.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="border border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    {blog.author ? blog.author[0].toUpperCase() : 'А'}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{blog.author || 'Запрошений автор'}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(blog.date).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                </div>

                <Link to={`/blogs/${blog.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">
                  {blog.previewText || blog.fullText?.substring(0, 150) + '...'}
                </p>
              </div>

              <div className="flex justify-end items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                <Link to={`/blogs/${blog.id}`} className="text-blue-600 font-medium hover:underline">
                  Читати повністю →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
