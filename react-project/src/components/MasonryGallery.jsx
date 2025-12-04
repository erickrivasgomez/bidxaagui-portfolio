import React, { useState } from 'react';
import Lightbox from './Lightbox'; // Assuming Lightbox component

const MasonryGallery = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="masonry-gallery">
      {images.map((image, index) => (
        <div key={index} className="gallery-item" onClick={() => openLightbox(index)}>
          <img src={image.src} alt={image.alt} />
        </div>
      ))}
      <Lightbox 
        images={images} 
        currentIndex={currentImageIndex} 
        isOpen={lightboxOpen} 
        onClose={closeLightbox} 
      />
    </div>
  );
};

export default MasonryGallery;
