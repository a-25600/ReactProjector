import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/news/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Статтю не знайдено');
          }
          throw new Error('Помилка завантаження статті');
        }

        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, API_URL]);

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500 animate-pulse">Завантаження статті...</div>;
  }

  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <span className="text-4xl block mb-4">📄</span>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Статтю не знайдено'}</h2>
        <Link to="/blogs" className="text-blue-600 font-medium hover:underline">
          Повернутися до списку блогів
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/blogs" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Усі блоги
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-gray-950 leading-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between border-y border-gray-200 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {blog.author ? blog.author[0].toUpperCase() : 'А'}
            </div>
            <div>
              <p className="font-bold text-gray-900">{blog.author || 'Запрошений автор'}</p>
              <p className="text-sm text-gray-500">
                {new Date(blog.date).toLocaleDateString('uk-UA', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {blog.imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
          <img src={blog.imageUrl} alt={blog.title} className="w-full h-auto max-h-[400px] object-cover" />
        </div>
      )}

      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-12">
        {blog.previewText && (
          <p className="text-xl text-gray-600 italic border-l-4 border-blue-600 pl-4 mb-8">
            {blog.previewText}
          </p>
        )}
        <p className="whitespace-pre-wrap">
          {blog.fullText}
        </p>
      </div>
    </article>
  );
};

export default BlogPost;
