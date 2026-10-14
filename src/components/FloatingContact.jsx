import React from 'react';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FloatingContact = () => {
  const phoneNumber = "919010215674";
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      zIndex: 100
    }}>
      {/* Call Button */}
      <motion.a 
        href={`tel:${phoneNumber}`}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          width: '60px',
          height: '60px',
          background: '#3b82f6', // Blue color for call
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
          cursor: 'pointer'
        }}
        title="Call Us"
      >
        <Phone size={28} fill="currentColor" />
      </motion.a>

      {/* WhatsApp Button */}
      <motion.a 
        href={`https://wa.me/${phoneNumber}?text=Hello! I am interested in TOGU Foundation's services.`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '60px',
          height: '60px',
          background: '#25D366', // WhatsApp green
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(37, 211, 102, 0.5)',
          cursor: 'pointer'
        }}
        title="WhatsApp Us"
      >
        <FaWhatsapp size={36} />
      </motion.a>
      
      <style>{`
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
      `}</style>
    </div>
  );
};

export default FloatingContact;
