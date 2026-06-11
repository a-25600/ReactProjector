const PostOfTheDay = ({source = 'Instagram', author = '@projector_media', text, imageUrl}) => {
	return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '16px',
      padding: '16px',
      backgroundColor: '#f9f9f9',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#777' }}>
        <span style={{ fontWeight: 'bold', color: '#e1306c' }}>Пост дня ({source})</span>
        <span>{author}</span>
      </div>
      {imageUrl && <img src={imageUrl} alt="Post content" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', objectFit: 'cover', maxHeight: '300px' }} />}
      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#333', fontStyle: 'italic' }}>
        "{text || 'Слідкуйте за нашими оновленнями в соціальних мережах, щоб не пропустити найважливіші події міста та культури!'}"
      </p>
    </div>
  )
}

export default PostOfTheDay;
