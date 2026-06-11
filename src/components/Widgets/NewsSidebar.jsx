import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewsSidebar = ({ onMoreClick, onArticleClick }) => {
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await fetch(`${API_URL}/news`);
        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            const formatted = data
              .filter(n => n.isApproved === true || n.IsApproved === true)
              .sort((a, b) => {
                const dateA = new Date(a.date || a.Date || 0).getTime();
                const dateB = new Date(b.date || b.Date || 0).getTime();
                return dateB - dateA;
              })
              .slice(0, 7)
              .map(n => ({
                id: n.id || n.Id,
                time: new Date(n.date || n.Date || Date.now()).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
                text: n.title || n.Title || 'Без заголовка'
              }));

            setNewsItems(formatted);
          }
        }
      } catch (err) { console.error("Помилка завантаження AdBanner:", err); }
    };
    fetchLatest();
  }, [API_URL]);

  return (
    <div style={{
      backgroundColor: '#3fa9e5',
      borderRadius: '24px',
      padding: '24px 20px',
      color: '#fff',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{
        textTransform: 'uppercase',
        fontSize: '20px',
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: '20px',
        letterSpacing: '0.5px'
      }}>
        Останні новини:
      </h3>

      {newsItems.length === 0 ? (
        <div style={{ padding: '10px 0', fontSize: '14px', color: '#e0f2fe' }}>
          Немає опублікованих новин...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {newsItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (onArticleClick) onArticleClick(item);
                else navigate(`/news/${item.id}`);
              }}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                paddingBottom: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                lineHeight: '1.4',
                color: '#ffffff',
                display: 'block'
              }}
            >
              <span style={{ fontWeight: '800', marginRight: '8px', color: '#fff' }}>
                {item.time}
              </span>
              <span style={{ color: '#fff', opacity: 1 }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onMoreClick}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          border: '2px solid #fff',
          borderRadius: '20px',
          color: '#fff',
          padding: '10px 0',
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          textTransform: 'uppercase',
          transition: 'all 0.2s'
        }}
      >
        Більше новин
      </button>
    </div>
  )
}

export default NewsSidebar;
