import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewsCard from '../../components/News/NewsCard';
import CategoryNav from '../../components/News/CategoryNav';

const categoryMap = {
    'actual': 'Актуальні події',
    'culture': 'Культура',
    'regions': 'Регіони',
    'showbiz': 'Шоубіз',
    'economy': 'Економіка',
    'tech': 'Технології'
};

const Category = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const currentCategoryName = categoryMap[categoryId] || 'Актуальні події';

    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchCategoryNews = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/news?category=${encodeURIComponent(currentCategoryName)}`);

                if (response.ok) {
                    const data = await response.json();
                    setNews(data);
                }
            } catch (error) {
                console.error("Помилка завантаження новин:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryNews();
    }, [currentCategoryName, API_URL]);

    const handleCategorySelect = (selectedName) => {
        const newCategoryId = Object.keys(categoryMap).find(key => categoryMap[key] === selectedName);
        if (newCategoryId) {
            navigate(`/category/${newCategoryId}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
                    {currentCategoryName}
                </h1>

                <div className="pb-4 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                    <CategoryNav
                        activeCategory={currentCategoryName}
                        onSelectCategory={handleCategorySelect}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">Завантаження публікацій...</div>
            ) : news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map(newsItem => (
                        <NewsCard
                            key={newsItem.id}
                            title={newsItem.title}
                            date={newsItem.date}
                            category={newsItem.category}
                            imageUrl={newsItem.imageUrl}
                            onClick={() => navigate(`/news/${newsItem.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
                    <span className="text-4xl block mb-4">📰</span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Новин не знайдено</h3>
                    <p className="text-gray-500">У рубриці «{currentCategoryName}» поки що немає публікацій.</p>
                </div>
            )}
        </div>
    );
};

export default Category;
