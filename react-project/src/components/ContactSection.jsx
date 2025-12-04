import React from 'react';
import NewsletterForm from './NewsletterForm';

const ContactSection = () => {
  return (
    <section className="contact-section">
      <h2>Stay in Touch</h2>
      <p>Subscribe to our newsletter for updates and news.</p>
      <NewsletterForm />
    </section>
  );
};

export default ContactSection;
