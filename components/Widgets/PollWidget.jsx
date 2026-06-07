const PollWidget = ({question = 'Чи підтримуєте ви новий формат донатів?', options = ['Так', 'Ні', 'Важко відповісти']}) => {
	const [voted, setVoted] = useState(false)

	return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '16px',
      padding: '20px',
      backgroundColor: '#fff',
      marginTop: '20px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>{question}</h4>
      {!voted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => setVoted(true)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #3fa9e5',
                backgroundColor: 'transparent',
                color: '#3fa9e5',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <p style={{ color: 'green', fontWeight: '600', fontSize: '14px' }}>Дякуємо за ваш голос!</p>
      )}
    </div>
  )
}

export default PollWidget;