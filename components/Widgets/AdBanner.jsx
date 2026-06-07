const AdBanner = ({newsItems = [], onMoreClick, onArticleClick}) => {
	const defaultItems = [
    { time: '18:50', text: 'Apple представила новий смартфон з 24 камерами' },
    { time: '18:44', text: 'Єдиний українець у "Шахтарі". Ексклюзив!' },
    { time: '18:35', text: 'У Житомирі пограбували панчішну крамницю: усі деталі' },
    { time: '18:24', text: '"Наступний тиждень буде вирішальним" - вирішальна заява!' },
    { time: '18:12', text: '"У вас вовчанка!". Цитати з "Доктора Хауса" на кожен день' },
    { time: '18:00', text: 'Сонячне затемнення, бійка століття та нові правила: головне на 18:00' },
    { time: '17:54', text: 'Небезпечно! На Прикарпатті туристи отруїлися грибами' }
  ];

	const itemsToRender = newsItems.length > 0 ? newsItems : defaultItems;

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {itemsToRender.map((item, index) => (
          <div 
            key={index} 
            onClick={() => onArticleClick && onArticleClick(item)}
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              paddingBottom: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              lineHeight: '1.4'
            }}
          >
            <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{item.time}</span>
            {item.text}
          </div>
        ))}
      </div>

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
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#fff';
          e.target.style.color = '#3fa9e5';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#fff';
        }}
      >
        Більше новин
      </button>
    </div>
  )
}

export default AdBanner;