import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/news?search=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Помилка пошуку:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, API_URL]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Результати пошуку</h1>
      <p className="text-gray-500 mb-8">
        Шукали: <span className="font-bold text-gray-800">«{query}»</span>
      </p>

      {isLoading ? (
        <div className="text-gray-500">Шукаємо...</div>
      ) : results.length === 0 ? (
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center text-gray-500 font-medium">
          На жаль, за вашим запитом нічого не знайдено. Спробуйте інші ключові слова.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {results.map((item) => (
            <Link to={`/news/${item.id || item.Id}`} key={item.id || item.Id} className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title || item.Title} className="w-full sm:w-48 h-32 object-cover rounded-xl" />
              )}
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {item.title || item.Title}
                </h2>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {item.previewText || item.PreviewText || 'Натисніть, щоб прочитати деталі...'}
                </p>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  {item.category || item.Category} • {new Date(item.date || item.Date).toLocaleDateString('uk-UA')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
