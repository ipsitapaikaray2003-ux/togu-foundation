import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const bgImages = [
  '/hero.jpg',      // Community
  '/education.jpg', // Education
  '/healthcare.jpg',// Healthcare
  '/women.jpg'      // Women Empowerment
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      overflow: 'hidden'
    }}>
      {/* Background with auto-scroll crossfade effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        backgroundColor: '#0f172a'
      }}>
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageIndex}
            src={bgImages[currentImageIndex]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            alt="Hero Background"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          zIndex: 1
        }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.8 }}
          style={{ maxWidth: '800px', color: '#f8fafc', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '9999px', marginBottom: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <span style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              Unity in Action, Growth for All
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)', marginBottom: '1.25rem', color: '#ffffff', lineHeight: 1.1 }}>
            Empowering <span className="gradient-text" style={{ background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Communities</span>, <br />
            Building the Future
          </h1>
          
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '600px', color: '#cbd5e1', lineHeight: 1.6 }}>
            TOGU Foundation stands for Trust, Opportunity, Growth, and Unity. We are dedicated to creating practical social-impact programmes for sustainable development.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/#about" className="btn" style={{ 
              background: '#10b981', color: 'white', fontSize: '1rem', padding: '0.875rem 1.75rem'
            }}>
              Discover Our Vision
            </a>
            <a href="/#get-involved" className="btn glass" style={{ 
              color: 'white', fontSize: '1rem', padding: '0.875rem 1.75rem', display: 'flex', gap: '0.5rem'
            }}>
              Get Involved <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
