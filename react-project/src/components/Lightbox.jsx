import React from 'react';

const Lightbox = ({ images, currentIndex, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lightbox">
      <div className="lightbox-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
        <div className="navigation">
          <button 
            onClick={() => currentIndex > 0 && setCurrentImageIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button 
            onClick={() => currentIndex < images.length - 1 && setCurrentImageIndex(currentIndex + 1)}
            disabled={currentIndex === images.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
