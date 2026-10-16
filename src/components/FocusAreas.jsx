import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, HeartPulse, Sparkles, GraduationCap, 
  Tractor, Briefcase, UserPlus, Accessibility, 
  TreePine, AlertTriangle, Utensils, Users 
} from 'lucide-react';

const focusAreas = [
  { title: "Education & Student Support", icon: <BookOpen />, color: "#0b4b25", bg: "rgba(11, 75, 37, 0.12)" },
  { title: "Healthcare & Health Awareness", icon: <HeartPulse />, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
  { title: "Women Empowerment", icon: <Sparkles />, color: "#d946ef", bg: "rgba(217, 70, 239, 0.1)" },
  { title: "Youth Skill Dev & Employment", icon: <GraduationCap />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  { title: "Rural & Community Dev", icon: <Tractor />, color: "#84cc16", bg: "rgba(132, 204, 22, 0.1)" },
  { title: "Livelihood & Entrepreneurship", icon: <Briefcase />, color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" },
  { title: "Senior Citizen Support", icon: <UserPlus />, color: "#14b8a6", bg: "rgba(20, 184, 166, 0.1)" },
  { title: "Support for PwD", icon: <Accessibility />, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
  { title: "Environment & Plantation", icon: <TreePine />, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  { title: "Disaster & Emergency", icon: <AlertTriangle />, color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" },
  { title: "Food & Essentials", icon: <Utensils />, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)" },
  { title: "Community Unity", icon: <Users />, color: "#06b6d4", bg: "rgba(6, 182, 212, 0.1)" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

const FocusAreas = () => {
  return (
    <section 
      id="focus-areas" 
      className="section" 
      style={{ 
        background: 'linear-gradient(135deg, #03150b 0%, #082d1a 50%, #041a0d 100%)', 
        position: 'relative', 
        zIndex: 1,
        overflow: 'hidden',
        scrollMarginTop: '76px'
      }}
    >
      <span id="core-commitments" style={{ position: 'absolute', top: '-76px', pointerEvents: 'none' }}></span>
      {/* Decorative ambient glowing lights */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(238, 163, 40, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(59, 142, 52, 0.18) 0%, transparent 70%)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center" 
          style={{ marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            background: 'rgba(238, 163, 40, 0.15)',
            border: '1px solid rgba(238, 163, 40, 0.35)',
            borderRadius: '9999px',
            marginBottom: '1rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eea328', display: 'inline-block' }}></span>
            <span style={{ color: '#eea328', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              AREAS OF ACTION
            </span>
          </div>

          <h2 className="section-title" style={{ color: 'var(--text-alt)' }}>Our Core Commitments</h2>
          <p className="section-subtitle" style={{ color: 'var(--text-alt-muted)' }}>
            Comprehensive programs designed to create holistic and sustainable impact across all sections of society.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}
        >
          {focusAreas.map((area, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="program-card"
              style={{
                '--card-theme': area.color,
                '--card-bg': area.bg,
                padding: '2rem 1.5rem',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div className="icon-container">
                {React.cloneElement(area.icon, { size: 32 })}
              </div>
              <h3 className="card-title">
                {area.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <style>{`
        .program-card {
          background: var(--surface);
          border: 1px solid var(--border);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .program-card:hover {
          background: var(--card-theme);
          border-color: var(--card-theme);
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px -12px var(--card-theme);
        }
        
        .icon-container {
          background: var(--card-bg);
          color: var(--card-theme);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .program-card:hover .icon-container {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: scale(1.15) translateY(-5px) rotate(10deg);
        }
        
        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary);
          line-height: 1.4;
          transition: color 0.4s ease;
        }
        
        .program-card:hover .card-title {
          color: white;
        }
      `}</style>
    </section>
  );
};

export default FocusAreas;
