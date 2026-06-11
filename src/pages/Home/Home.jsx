import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import TagCloud from '../../components/News/TagCloud';
import NewsSidebar from '../../components/Widgets/NewsSidebar';
import AdBanner from '../../components/Widgets/AdBanner';
import VideoGallery from '../../components/Media/VideoGallery';

const Home = () => {
  const [news, setNews] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tagQuery = searchParams.get('tag');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        let fetchUrl = `${API_URL}/news`;
        if (tagQuery) {
          fetchUrl += `?tag=${encodeURIComponent(tagQuery)}`;
        }

        const response = await fetch(fetchUrl);
        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            const approvedNews = data.filter(n => n.isApproved === true || n.IsApproved === true);
            setNews(approvedNews);
          }
        }
      } catch (error) {
        console.error("Помилка завантаження новин:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [tagQuery, API_URL]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/news/tags`);
        if (response.ok) {
          const data = await response.json();
          setAllTags(data);
        }
      } catch (error) {
        console.error("Помилка завантаження тегів:", error);
      }
    };

    fetchTags();
  }, [API_URL]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="lg:w-2/3">
          <div className="flex justify-between items-end mb-8 border-b-4 border-blue-500 pb-2">
            <h1 className="text-3xl font-black text-gray-900 uppercase">
              {tagQuery ? `Новини за тегом: #${tagQuery}` : 'Всі новини'}
            </h1>
            {tagQuery && (
              <button onClick={() => navigate('/')} className="text-sm font-bold text-blue-600 hover:underline">
                Скинути фільтр &times;
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-gray-500">Завантаження стрічки новин...</div>
          ) : news.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center text-gray-500 font-medium">
              Новин {tagQuery ? 'за цим тегом ' : ''}поки немає.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <Link to={`/news/${item.id || item.Id}`} key={item.id || item.Id} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title || item.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                      {item.category || item.Category || 'Новини'}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                      {item.title || item.Title}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {new Date(item.date || item.Date).toLocaleDateString('uk-UA')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-1/3 space-y-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold uppercase mb-4 text-gray-900 tracking-tight">
              Популярні теми
            </h3>

            {allTags.length > 0 ? (
              <TagCloud
                tags={allTags}
                onTagClick={(tag) => {
                  navigate(`/?tag=${encodeURIComponent(tag)}`);
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">Тегів поки немає...</p>
            )}
          </div>

          <NewsSidebar />
          <AdBanner />

        </div>
      </div>
    </div>
  );
};

export default Home;
