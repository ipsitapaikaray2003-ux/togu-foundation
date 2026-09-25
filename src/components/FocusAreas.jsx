import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, HeartPulse, Sparkles, GraduationCap, 
  Tractor, Briefcase, UserPlus, Accessibility, 
  TreePine, AlertTriangle, Utensils, Users 
} from 'lucide-react';

const focusAreas = [
  { title: "Education & Student Support", icon: <BookOpen />, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
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
    <section id="core-commitments" className="section" style={{ background: 'var(--bg-alt)', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center" 
          style={{ marginBottom: '4rem' }}
        >
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
