const PodcastPlayer = ({title = 'Подкаст №1Ж Індустрфальний туризм в Україні', audioUrl}) => {
	return (
    <div style={{
      backgroundColor: '#f1f3f4',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '15px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🎙️</span>
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#202124' }}>{title}</span>
      </div>
      <audio controls style={{ width: '100%' }} src={audioUrl}>
        Ваш браузер не підтримує аудіоелементи.
      </audio>
    </div>
  )
}

export default PodcastPlayer;
