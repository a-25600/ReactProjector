import React from 'react';
import VideoGallery from '../../components/Media/VideoGallery';

const VideoPage = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-4xl font-black text-gray-900 mb-8 uppercase text-center border-b pb-6">
        Усі відеоматеріали
      </h1>
      <VideoGallery />
    </div>
  );
};

export default VideoPage;
