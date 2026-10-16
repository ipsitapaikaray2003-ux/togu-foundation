import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users } from 'lucide-react';

const About = () => {
  const [aboutData, setAboutData] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/content/about')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.section?.content) {
          setAboutData(data.section.content);
        }
      })
      .catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="about" className="section about-section" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Blurry Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(238, 163, 40, 0.18) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(11, 75, 37, 0.18) 0%, transparent 70%)', filter: 'blur(90px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '40%', right: '15%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(59, 142, 52, 0.12) 0%, transparent 70%)', filter: 'blur(70px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
          style={{ marginBottom: '5rem' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">Who We Are</h2>
            <div style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #0b4b25, #eea328)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.5px'
            }}>
              "ఐక్యతే మా శక్తి - సేవే మా ధర్మం - అభివృద్ధే మా లక్ష్యం."
            </div>
            <p className="section-subtitle" style={{ fontSize: '1.2rem' }}>
              Unity is our strength - Service is our duty - Development is our goal.
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
        >
          {/* Vision Card - Forest Green */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(11, 75, 37, 0.5)' }}
            className="about-card"
            style={{
              background: 'linear-gradient(135deg, #0b4b25, #07351a)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '24px',
              boxShadow: '0 10px 30px -10px rgba(11, 75, 37, 0.35)',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                color: 'white',
                padding: '1.25rem',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                display: 'inline-flex',
                backdropFilter: 'blur(5px)'
              }}
            >
              <Lightbulb size={36} />
            </motion.div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'white' }}>Our Vision</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {aboutData?.vision || "To build an inclusive and empowered society where every person has access to education, healthcare, opportunities, skills and sustainable development."}
            </p>
          </motion.div>

          {/* Mission Card - Warm Golden Amber */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(238, 163, 40, 0.5)' }}
            style={{
              background: 'linear-gradient(135deg, #eea328, #d48b13)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '24px',
              boxShadow: '0 10px 30px -10px rgba(238, 163, 40, 0.35)',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: 'rgba(255, 255, 255, 0.22)',
                color: 'white',
                padding: '1.25rem',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                display: 'inline-flex',
                backdropFilter: 'blur(5px)'
              }}
            >
              <Target size={36} />
            </motion.div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'white' }}>Our Mission</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              {aboutData?.mission || "TOGU Foundation aims to work with communities, volunteers, donors and organisations to create practical social-impact programmes focused on uplifting society across various domains."}
            </p>
          </motion.div>
          
          {/* Values Card - Leaf Green */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(46, 125, 50, 0.5)' }}
            style={{
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '24px',
              boxShadow: '0 10px 30px -10px rgba(46, 125, 50, 0.35)',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                color: 'white',
                padding: '1.25rem',
                borderRadius: '20px',
                marginBottom: '1.5rem',
                display: 'inline-flex',
                backdropFilter: 'blur(5px)'
              }}
            >
              <Users size={36} />
            </motion.div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'white' }}>Core Values (TOGU)</h3>
            <ul style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.1rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
              <li><strong style={{ color: 'white' }}>T</strong>rust - Building reliable partnerships</li>
              <li><strong style={{ color: 'white' }}>O</strong>pportunity - Creating paths to success</li>
              <li><strong style={{ color: 'white' }}>G</strong>rowth - Fostering sustainable progress</li>
              <li><strong style={{ color: 'white' }}>U</strong>nity - Bringing people together</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
      <style>{`
        .about-section {
          background: linear-gradient(180deg, #e8f4ec 0%, #f3f8f4 50%, #edf6ef 100%);
        }
        .dark-mode .about-section {
          background: linear-gradient(180deg, #05190e 0%, #082415 50%, #051b10 100%) !important;
        }
      `}</style>
    </section>
  );
};

export default About;
