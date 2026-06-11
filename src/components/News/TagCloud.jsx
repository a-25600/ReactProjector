const TagCloud = ({tags = ['Кривий Ріг', 'Дія', 'Допомога', 'Технології'], onTagClick}) => {
	const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '10px 0',
  }

	const tagStyle = {
    backgroundColor: '#f0f2f5',
    color: '#4e5d6c',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

	return (
    <div style={containerStyle}>
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          style={tagStyle} 
          onClick={() => onTagClick && onTagClick(tag)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e2e6ea'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f0f2f5'}
        >
          #{tag}
        </span>
      ))}
    </div>
  )
}

export default TagCloud;
