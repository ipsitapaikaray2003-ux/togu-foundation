import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Users } from 'lucide-react';

const About = () => {
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
    <section id="about" className="section" style={{ background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative Blurry Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.1)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 }}></div>

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
              background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
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
          {/* Vision Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5)' }}
            className="about-card"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '24px',
              boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.3)',
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
                background: 'rgba(255, 255, 255, 0.2)',
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
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              To build an inclusive and empowered society where every person has access to <strong>education</strong>, <strong>healthcare</strong>, opportunities, skills and sustainable development.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.5)' }}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '24px',
              boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.3)',
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
                background: 'rgba(255, 255, 255, 0.2)',
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
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              TOGU Foundation aims to work with communities, volunteers, donors and organisations to create practical social-impact programmes focused on uplifting society across various domains.
            </p>
          </motion.div>
          
          {/* Values Card */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -12, boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.5)' }}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
              color: 'white',
              padding: '2.5rem',
              borderRadius: '24px',
              boxShadow: '0 10px 30px -10px rgba(14, 165, 233, 0.3)',
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
                background: 'rgba(255, 255, 255, 0.2)',
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
            <ul style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
              <li><strong style={{ color: 'white' }}>T</strong>rust - Building reliable partnerships</li>
              <li><strong style={{ color: 'white' }}>O</strong>pportunity - Creating paths to success</li>
              <li><strong style={{ color: 'white' }}>G</strong>rowth - Fostering sustainable progress</li>
              <li><strong style={{ color: 'white' }}>U</strong>nity - Bringing people together</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
