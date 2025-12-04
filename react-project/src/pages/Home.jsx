import React from 'react';
import Header from '../components/Header';
import WelcomeSection from '../components/WelcomeSection';
import HeroSection from '../components/HeroSection';
import BioSection from '../components/BioSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <WelcomeSection />
      <HeroSection />
      <BioSection title="About Us" content="Information about the organization." iconType="about" />
      <BioSection title="Our Mission" content="Details about the mission." iconType="mission" />
      <BioSection title="Our Values" content="Description of values." iconType="values" />
      <BioSection title="Get Involved" content="How to get involved." iconType="involved" />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
