import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">Logo</Link>
        </div>
        <button onClick={toggleMobileMenu} className="mobile-menu-button">
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/comunidad">Comunidad</Link></li>
          <li><Link to="/consultorio">Consultorio</Link></li>
          <li><Link to="/antroponomadas">Antroponomadas</Link></li>
          <li><Link to="/antropologia-fisica">Antropología Física</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
