import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { 
  Stethoscope, Activity, FileText, Home, Phone, ArrowRight, 
  ShieldCheck, Clock, Award, Microscope, HeartPulse, Dna 
} from 'lucide-react';

const Counter = ({ end, suffix = "", duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, end, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => setCount(Math.floor(value))
      });
      return () => controls.stop();
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const Healthcare = () => {
  const services = [
    { title: "Radiology & Imaging", icon: <Activity size={32} />, desc: "High-resolution MRI, CT Scans, X-Ray, and advanced Ultrasound imaging." },
    { title: "Pathology & Lab Tests", icon: <FileText size={32} />, desc: "Accurate blood tests, biochemistry, and microbiology profiles with quick results." },
    { title: "Comprehensive Packages", icon: <Stethoscope size={32} />, desc: "Master health checkups tailored for men, women, and senior citizens." },
    { title: "Home Sample Collection", icon: <Home size={32} />, desc: "Book an appointment and get your blood samples collected from the comfort of home." },
    { title: "Advanced Cardiology", icon: <HeartPulse size={32} />, desc: "ECG, 2D Echo, TMT, and specialized cardiac profiling." },
    { title: "Genomics & Genetics", icon: <Dna size={32} />, desc: "Next-gen genetic testing for personalized health insights." }
  ];

  const packages = [
    { title: "Basic Health Check", price: "₹1,499", features: ["Complete Blood Count", "Lipid Profile", "Liver Function", "Kidney Function"] },
    { title: "Executive Health Check", price: "₹3,999", features: ["Cardiac Risk Markers", "Thyroid Profile", "Vitamin D & B12", "HbA1c & Fasting Sugar"], recommended: true },
    { title: "Senior Citizen Profile", price: "₹2,499", features: ["Bone Health", "Prostate/Ovarian Markers", "Complete Urine Exam", "Arthritis Profile"] }
  ];

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--surface)', overflow: 'hidden' }}>
      
      {/* 1. Massive Premium Hero Section */}
      <section style={{ 
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        backgroundImage: "url('/healthcare.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Deep Medical Blue Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7))' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            style={{ maxWidth: '650px', color: 'white' }}
          >
            <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(4px)' }}>
              TOGU Healthcare Initiative
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.15, textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              Precision Diagnostics <br/> <span style={{ color: '#60a5fa' }}>For a Healthier Tomorrow</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              In collaboration with leading healthcare providers like <strong>Vijaya Diagnostic Centre</strong>, we bring world-class diagnostic services, radiology scans, and reliable laboratory tests closer to you.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#packages" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.125rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                View Packages
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats & Trust Section */}
      <section style={{ padding: '3rem 0', background: 'var(--primary)', color: 'white', position: 'relative' }}>
        {/* Subtle decorative background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ width: '150px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div style={{ color: '#3b82f6', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}><ShieldCheck size={28} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>NABL</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Accredited Labs</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ width: '150px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div style={{ color: '#10b981', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}><Clock size={28} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}><Counter end={24} suffix="/7" /></h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Sample Collection</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              style={{ width: '150px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div style={{ color: '#f59e0b', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}><Microscope size={28} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}><Counter end={5000} suffix="+" /></h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Advanced Tests</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.3 }}
              style={{ width: '150px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
            >
              <div style={{ color: '#d946ef', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}><Award size={28} /></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}><Counter end={15} suffix="+" /></h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Years of Trust</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Comprehensive Services Grid */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="section-title" style={{ color: 'var(--text-alt)' }}>Our Comprehensive Services</h2>
            <p className="section-subtitle" style={{ color: 'var(--text-alt-muted)' }}>
              Ensuring accurate diagnosis and reliable results with state-of-the-art technology.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                style={{
                  background: 'var(--surface)',
                  padding: '2.5rem',
                  borderRadius: '24px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, var(--secondary), #0ea5e9)',
                  color: 'white',
                  padding: '1.25rem',
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Health Packages Section */}
      <section id="packages" className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="section-title">Popular Health Packages</h2>
            <p className="section-subtitle">
              Preventive care is the best cure. Choose a package that suits your lifestyle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={{
                  background: pkg.recommended ? 'linear-gradient(135deg, var(--secondary), #0ea5e9)' : 'var(--bg-color)',
                  color: pkg.recommended ? 'white' : 'var(--text-main)',
                  padding: '3rem 2rem',
                  borderRadius: '24px',
                  border: pkg.recommended ? 'none' : '1px solid var(--border)',
                  boxShadow: pkg.recommended ? '0 25px 50px -12px rgba(37, 99, 235, 0.4)' : '0 10px 25px rgba(0,0,0,0.02)',
                  position: 'relative',
                  transform: pkg.recommended ? 'scale(1.05)' : 'scale(1)',
                  zIndex: pkg.recommended ? 2 : 1
                }}
              >
                {pkg.recommended && (
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: pkg.recommended ? 'white' : 'var(--primary)' }}>{pkg.title}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>{pkg.price}</div>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.125rem' }}>
                      <ShieldCheck size={20} color={pkg.recommended ? '#93c5fd' : 'var(--accent)'} /> {feature}
                    </li>
                  ))}
                </ul>
                
                <a 
                  href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hi, I would like to book the ${pkg.title} package for ${pkg.price}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${pkg.recommended ? 'btn-outline' : 'btn-primary'}`} 
                  style={{ width: '100%', borderColor: pkg.recommended ? 'white' : 'transparent', color: pkg.recommended ? 'white' : 'white', display: 'flex', justifyContent: 'center' }}
                >
                  Book Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Contact / CTA Banner */}
      <section style={{ padding: '0 0 6rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #020617, #0f172a)',
              borderRadius: '24px',
              padding: '5rem 2rem',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative background circle */}
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(100px)', opacity: 0.5 }}></div>
            <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '300px', height: '300px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.5 }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Need Immediate Assistance?</h2>
              <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                Reach out to Vijaya Diagnostic Centre directly to book your tests, upload prescriptions, or get home sample collection.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="tel:1234567890" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem', fontSize: '1.125rem', borderRadius: '50px' }}>
                  <Phone size={24} /> Call 1234567890
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Healthcare;
