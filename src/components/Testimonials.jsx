import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: "TOGU Foundation has helped many children continue their education. Their dedication towards society is truly inspiring.",
    name: "Ramesh Singh",
    role: "Volunteer"
  },
  {
    text: "I learned computer skills through their training program, which helped me get my first job. Thank you for changing my life.",
    name: "Anjali Verma",
    role: "Student"
  },
  {
    text: "Their healthcare camps and awareness programs have made a real difference in our community.",
    name: "Vikas Kumar",
    role: "Community Member"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section" style={{ background: 'var(--bg-color)', position: 'relative' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center" 
          style={{ marginBottom: '4rem' }}
        >
          <h4 style={{ 
            color: '#f97316', 
            textTransform: 'uppercase', 
            letterSpacing: '2px', 
            fontWeight: '700', 
            fontSize: '0.875rem',
            marginBottom: '1rem' 
          }}>
            TESTIMONIALS
          </h4>
          <h2 className="section-title">What People Say About Us</h2>
          <p className="section-subtitle">
            Our journey is reflected through the voices of the people whose lives we have touched.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          justifyContent: 'center'
        }}>
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="testimonial-card"
              style={{
                background: 'var(--surface)',
                borderRadius: '24px',
                padding: '2.5rem',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p style={{ 
                color: 'var(--text-muted)', 
                lineHeight: '1.7', 
                marginBottom: '2rem', 
                flex: 1 
              }}>
                {testimonial.text}
              </p>
              <div>
                <h4 style={{ 
                  color: 'var(--bg-alt)', 
                  fontSize: '1.25rem', 
                  fontWeight: '700', 
                  marginBottom: '0.25rem' 
                }}>
                  {testimonial.name}
                </h4>
                <span style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.875rem' 
                }}>
                  {testimonial.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
