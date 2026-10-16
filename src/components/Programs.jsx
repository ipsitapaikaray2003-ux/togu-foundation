import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultPrograms = [
  {
    title: "Education Initiative",
    description: "Providing quality education and digital literacy to underprivileged children, ensuring they have a bright and secure future.",
    image: "/education.jpg",
    color: "#0b4b25" // Forest Green
  },
  {
    title: "Healthcare Camps",
    description: "Organizing free medical checkups, providing essential medicines, and raising health awareness in rural communities.",
    image: "/healthcare.jpg",
    color: "#2e7d32" // Leaf Green
  },
  {
    title: "Women Empowerment",
    description: "Skill development and micro-finance support to help women become financially independent and leaders in their communities.",
    image: "/women.jpg",
    color: "#eea328" // Golden Amber
  },
  {
    title: "Community Outreach",
    description: "Building resilient communities through disaster relief, food distribution, and sustainable livelihood programs.",
    image: "/outreach.jpg",
    color: "#d97706" // Warm Amber
  },
  {
    title: "Skill Development",
    description: "Equipping the youth with modern vocational skills, computer training, and career counseling to increase employability.",
    image: "/education.jpg",
    color: "#0f766e" // Deep Teal
  },
  {
    title: "Environment Protection",
    description: "Conducting large-scale plantation drives, waste management awareness, and sustainable agricultural practices.",
    image: "/hero.jpg",
    color: "#15803d" // Emerald
  },
  {
    title: "Rural & Community Development",
    description: "Supporting sustainable rural development through livelihood promotion, sanitation, infrastructure, clean drinking water, and community capacity building.",
    image: "/rural_development.jpg",
    color: "#166534"
  },
  {
    title: "Child Welfare & Protection",
    description: "Ensuring every child has access to education, healthcare, nutrition, protection, and a safe, nurturing environment.",
    image: "/child_welfare.jpg",
    color: "#b45309"
  },
  {
    title: "Social Inclusion & Community Welfare",
    description: "Empowering marginalized communities, senior citizens, persons with disabilities, and economically weaker sections through inclusive development programs.",
    image: "/social_inclusion.jpg",
    color: "#047857"
  },
  {
    title: "Research, Awareness & Advocacy",
    description: "Conducting research and advocacy campaigns to raise awareness about important social issues, mobilize resources, and drive policy changes.",
    image: "/research_advocacy.jpg?v=2",
    color: "#c2410c"
  }
];

const Programs = () => {
  const [dbPrograms, setDbPrograms] = React.useState([]);

  React.useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.programs) && data.programs.length > 0) {
          const colors = ["#0b4b25", "#ef4444", "#d946ef", "#f59e0b", "#84cc16", "#6366f1", "#14b8a6", "#8b5cf6", "#10b981", "#f97316", "#eab308", "#06b6d4"];
          const mapped = data.programs.map((p, idx) => ({
            title: p.title,
            description: p.short_description || p.full_description,
            image: p.cover_image || '/education.jpg',
            color: colors[idx % colors.length],
            isHealthcare: (p.category && p.category.toLowerCase() === 'healthcare') || p.title.toLowerCase().includes('healthcare')
          }));
          setDbPrograms(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const displayPrograms = dbPrograms.length > 0 ? dbPrograms : defaultPrograms;
  return (
    <section id="programs" className="section programs-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative ambient background accents */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(238, 163, 40, 0.16) 0%, transparent 70%)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(11, 75, 37, 0.16) 0%, transparent 70%)', filter: 'blur(90px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

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
            background: 'rgba(11, 75, 37, 0.08)',
            border: '1px solid rgba(11, 75, 37, 0.2)',
            borderRadius: '9999px',
            marginBottom: '1rem',
            boxShadow: '0 2px 10px rgba(11, 75, 37, 0.05)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eea328', display: 'inline-block' }}></span>
            <span style={{ color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Impact Initiatives
            </span>
          </div>

          <h2 className="section-title">Our Programs</h2>
          <p className="section-subtitle">
            Discover our key initiatives aimed at creating a lasting, positive change in society.
          </p>
        </motion.div>

        <div className="programs-grid" style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem' 
        }}>
          {displayPrograms.map((program, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="ngo-program-card"
              style={{
                '--hover-color': program.color,
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'var(--surface)',
                border: '1px solid rgba(11, 75, 37, 0.14)',
                boxShadow: '0 12px 32px -6px rgba(11, 75, 37, 0.08)',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 300px',
                maxWidth: '400px'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img 
                  src={program.image} 
                  alt={program.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="program-img"
                />
              </div>
              <div className="program-content" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', transition: 'all 0.4s ease' }}>
                <h3 className="program-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)', transition: 'color 0.4s ease' }}>
                  {program.title}
                </h3>
                <p className="program-desc" style={{ color: 'var(--text-muted)', marginBottom: '0', lineHeight: 1.6, flex: 1, transition: 'color 0.4s ease' }}>
                  {program.description}
                </p>
                {(program.isHealthcare || program.title === "Healthcare Camps") && (
                  <Link 
                    to="/healthcare" 
                    style={{ 
                      marginTop: '1.25rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      color: 'var(--primary)', 
                      fontWeight: 700, 
                      fontSize: '0.9rem' 
                    }}
                  >
                    Explore Diagnostic & Blood Test Packages <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .programs-section {
          background: linear-gradient(180deg, #edf6f0 0%, #e3f0e7 50%, #ebf4ee 100%);
        }
        .dark-mode .programs-section {
          background: linear-gradient(180deg, #05190e 0%, #082617 50%, #061f12 100%) !important;
        }
        .dark-mode .ngo-program-card {
          background: rgba(11, 38, 24, 0.85) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .ngo-program-card {
          transition: all 0.4s ease;
        }
        .ngo-program-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(11, 75, 37, 0.25);
        }
        .ngo-program-card:hover .program-img {
          transform: scale(1.1);
        }
        .ngo-program-card:hover .program-content {
          background: var(--hover-color);
        }
        .ngo-program-card:hover .program-title,
        .ngo-program-card:hover .program-desc {
          color: white !important;
        }
      `}</style>
    </section>
  );
};

export default Programs;
