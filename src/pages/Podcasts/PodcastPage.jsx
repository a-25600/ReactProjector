import { useState, useEffect } from 'react';
import PodcastPlayer from '../../components/Media/PodcastPlayer';
import CategoryNav from '../../components/News/CategoryNav';

const PodcastPage = () => {
    const [activeCategory, setActiveCategory] = useState('Усі');
    const [podcasts, setPodcasts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchPodcasts = async () => {
            setIsLoading(true);
            try {
                const query = activeCategory === 'Усі' ? '' : `?category=${encodeURIComponent(activeCategory)}`;
                const response = await fetch(`${API_URL}/podcasts${query}`);

                if (response.ok) setPodcasts(await response.json());
            } catch (error) {
                console.error("Помилка завантаження подкастів:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPodcasts();
    }, [activeCategory, API_URL]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-4xl font-black text-brand-dark mb-4">Подкасти</h1>
                <CategoryNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                <button
                    onClick={() => setActiveCategory('Усі')}
                    className={`mt-4 text-sm font-medium ${activeCategory === 'Усі' ? 'text-brand-blue font-bold' : 'text-gray-500'}`}
                >
                    Показати всі
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Завантаження аудіо...</div>
            ) : podcasts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {podcasts.map(podcast => (
                        <div key={podcast.id} className="h-full">
                            <PodcastPlayer title={podcast.title} audioUrl={podcast.audioUrl} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl">
                    <span className="text-4xl block mb-3">🎧</span>
                    <p className="text-gray-500">У цій категорії поки немає подкастів.</p>
                </div>
            )}
        </div>
    );
};

export default PodcastPage;
