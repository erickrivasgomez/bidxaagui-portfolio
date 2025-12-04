import React, { useState, useEffect } from 'react';
import { usePrevious } from '../hooks/usePrevious'; // Import the usePrevious hook
import Header from '../components/Header';
import Footer from '../components/Footer';
import TherapyCard from '../components/TherapyCard';
import TherapyModal from '../components/TherapyModal';
import therapiesData from '../js/therapies-data.js'; // Ensure correct import

const Consultorio = () => {
  const [therapies, setTherapies] = useState([]);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const previousTherapy = usePrevious(selectedTherapy); // Use the hook to track previous therapy

  useEffect(() => {
    // Simulate fetching therapy data
    setTherapies(therapiesData);
  }, []);

  const openModal = (therapy) => {
    setSelectedTherapy(therapy);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTherapy(null);
    setModalOpen(false);
  };

  return (
    <div>
      <Header />
      <h1>Consultorio</h1>
      <div className="therapy-grid">
        {therapies.map((therapy) => (
          <TherapyCard 
            key={therapy.id} 
            therapyData={therapy} 
            onClick={() => openModal(therapy)} 
          />
        ))}
      </div>
      <TherapyModal 
        therapyData={selectedTherapy} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
      <Footer />
    </div>
  );
};

export default Consultorio;
