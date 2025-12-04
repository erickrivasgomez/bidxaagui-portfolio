import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <img src="/assets/images/profile.jpg" alt="Profile" className="profile-image" />
      <blockquote>
        <p>"Your quote or tagline goes here."</p>
        <footer>- Author Name</footer>
      </blockquote>
    </section>
  );
};

export default HeroSection;
