import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const defaultBgImages = [
  '/hero.jpg',      // Community
  '/education.jpg', // Education
  '/healthcare.jpg',// Healthcare
  '/women.jpg'      // Women Empowerment
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch('/api/content/hero')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.section?.content) {
          setHeroData(data.section.content);
        }
      })
      .catch(() => {});
  }, []);

  // Filter out any broken placeholder names (e.g. /hero1.jpg) and ensure fallback
  const sanitizedSlider = (heroData?.sliderImages && Array.isArray(heroData.sliderImages))
    ? heroData.sliderImages.filter(img => img && !img.includes('hero1.jpg') && !img.includes('hero2.jpg') && !img.includes('hero3.jpg') && !img.includes('hero4.jpg'))
    : [];

  const activeImages = sanitizedSlider.length > 0 ? sanitizedSlider : defaultBgImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % activeImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [activeImages.length]);

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
        backgroundColor: '#051a0e'
      }}>
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageIndex}
            src={activeImages[currentImageIndex] || defaultBgImages[0]}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultBgImages[currentImageIndex % defaultBgImages.length];
            }}
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
        
        {/* Gradient Overlay for rich contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5, 26, 14, 0.55) 0%, rgba(4, 18, 10, 0.76) 100%)',
          zIndex: 1
        }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.8 }}
          style={{ maxWidth: '820px', color: '#f8fafc', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.15rem', 
            background: 'rgba(238, 163, 40, 0.15)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '9999px', 
            marginBottom: '1.25rem', 
            border: '1px solid rgba(238, 163, 40, 0.35)' 
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eea328', display: 'inline-block' }}></span>
            <span style={{ fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '0.75rem', color: '#eea328' }}>
              Together for Good • United for Change
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4.2rem)', marginBottom: '1.25rem', color: '#ffffff', lineHeight: 1.12, fontFamily: 'var(--font-heading)' }}>
            {heroData?.heading ? (
              heroData.heading
            ) : (
              <>
                Empowering <span style={{ background: 'linear-gradient(135deg, #4ade80, #eea328)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Communities</span>, <br />
                Building a Brighter Future
              </>
            )}
          </h1>
          
          <p style={{ fontSize: '1.125rem', marginBottom: '2.25rem', maxWidth: '620px', color: '#d1fae5', lineHeight: 1.65 }}>
            {heroData?.subheading || "TOGU Foundation stands for Trust, Opportunity, Growth, and Unity. We create impactful grassroots initiatives across health, education, and women empowerment."}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="/#about" className="btn btn-gold" style={{ 
              fontSize: '1rem', padding: '0.875rem 1.85rem'
            }}>
              Discover Our Vision
            </a>
            <a href="/#get-involved" className="btn glass" style={{ 
              color: 'white', fontSize: '1rem', padding: '0.875rem 1.85rem', display: 'flex', gap: '0.5rem',
              borderColor: 'rgba(255, 255, 255, 0.3)'
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
