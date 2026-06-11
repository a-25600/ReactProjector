import { useState, useEffect } from 'react';

const AdBanner = () => {
  const [ads, setAds] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_URL}/ads/active`);
        if (response.ok) {
          const data = await response.json();
          setAds(data);
        }
      } catch (error) {
        console.error("Помилка завантаження реклами:", error);
      }
    };

    fetchAds();
  }, [API_URL]);

  if (ads.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 my-6">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-200 group"
        >
          <img
            src={ad.imageUrl}
            alt={`Рекламний банер ${ad.companyName}`}
            className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity"
          />
        </a>
      ))}
    </div>
  );
};

export default AdBanner;
