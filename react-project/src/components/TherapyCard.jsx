import React from 'react';

const TherapyCard = ({ therapyData, onClick }) => {
  return (
    <div className="therapy-card" onClick={onClick}>
      <div className="emoji">{therapyData.emoji}</div>
      <h3>{therapyData.title}</h3>
      <p>{therapyData.subtitle}</p>
      <button>Learn More</button>
    </div>
  );
};

export default TherapyCard;
