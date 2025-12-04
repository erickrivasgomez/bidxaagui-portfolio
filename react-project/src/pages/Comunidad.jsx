import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MasonryGallery from '../components/MasonryGallery';

const Comunidad = () => {
  const images = [
    { src: '/assets/images/downloads/bazarcita-01.jpg', alt: 'Bazarcita 01' },
    { src: '/assets/images/downloads/bazarcita-02.jpg', alt: 'Bazarcita 02' },
    { src: '/assets/images/downloads/bazarcita-03.jpg', alt: 'Bazarcita 03' },
    // Add more images as needed
  ];

  return (
    <div>
      <Header />
      <h1>Comunidad</h1>
      <MasonryGallery images={images} />
      <Footer />
    </div>
  );
};

export default Comunidad;
