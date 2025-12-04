import React from 'react';

const TherapyModal = ({ therapyData, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="therapy-modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{therapyData.title}</h2>
        <p>{therapyData.description}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TherapyModal;
