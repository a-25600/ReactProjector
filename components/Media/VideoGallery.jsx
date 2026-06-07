const VideoGallery = ({videos = []}) => {
	const placeholderVideos = [
    { id: '1', title: 'WEEKEND в стилі INDUSTRIAL: Кривий Ріг', embedId: 'dQw4w9WgXcQ' }
  ]

	const currentVideos = videos.length > 0 ? videos : placeholderVideos

	return (
    <div style={{ padding: '20px 0' }}>
      <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#333' }}>Відеогалерея Прожектор</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {currentVideos.map((video) => (
          <div key={video.id} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.embedId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.title}
            />
            <div style={{ padding: '12px', backgroundColor: '#fff', fontWeight: '600', fontSize: '14px' }}>
              {video.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VideoGallery;