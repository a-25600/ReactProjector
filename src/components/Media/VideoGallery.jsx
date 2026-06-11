import { useState, useEffect } from 'react';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : url;
  return `https://www.youtube.com/embed/${videoId}`;
};

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/videos`);
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Помилка завантаження відео:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [API_URL]);

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Завантаження відео...</div>;
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex justify-between items-end mb-6 border-b-4 border-red-500 pb-2">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Відеогалерея
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id || video.Id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col"
          >
            <div className="relative pt-[56.25%] bg-gray-100 w-full">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={getYouTubeEmbedUrl(video.videoUrl || video.VideoUrl)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title || video.Title}
              />
            </div>

            <div className="p-4 flex-grow flex items-center">
              <h3 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition-colors line-clamp-2">
                {video.title || video.Title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
