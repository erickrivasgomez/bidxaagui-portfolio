import React from 'react';

const BioSection = ({ title, content, iconType, reverseLayout, altStyling }) => {
  return (
    <section className={`bio-section ${reverseLayout ? 'reverse' : ''} ${altStyling}`}>
      <div className="icon">
        <img src={`/assets/icons/${iconType}.svg`} alt={title} />
      </div>
      <div className="bio-content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </section>
  );
};

export default BioSection;
