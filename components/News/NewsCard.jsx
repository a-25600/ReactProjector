const NewsCard = ({title, date, category, imageUrl, variant = 'standart', onClick}) => {
	const isLarge = variant === 'large'

	const cardStyle = {
		position: 'relative',
		borderRadius: '16px',
		overflow: 'hidden',
		cursor: 'pointer',
		marginBottom: '20px',
		boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
	}

	const imageStyle = {
		width: '100%',
		height: '100%',
		objectFit: 'cover',
	}

	const overlayStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)',
    padding: '20px',
    color: '#fff',
  }

	const metaStyle = {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '8px',
    opacity: 0.9,
  }

	const titleStyle = {
    fontSize: isLarge ? '22px' : '18px',
    fontWeight: 'bold',
    margin: 0,
    lineHeight: '1.3',
  }

	return (
    <div style={cardStyle} onClick={onClick}>
      <img src={imageUrl} alt={title} style={imageStyle} />
      <div style={overlayStyle}>
        <div style={metaStyle}>
          {date} • <span style={{ color: '#54b4e6' }}>{category}</span>
        </div>
        <h3 style={titleStyle}>{title}</h3>
      </div>
    </div>
  )
}

export default NewsCard;