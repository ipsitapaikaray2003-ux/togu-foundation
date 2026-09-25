import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const programs = [
  {
    title: "Education Initiative",
    description: "Providing quality education and digital literacy to underprivileged children, ensuring they have a bright and secure future.",
    image: "/education.jpg",
    color: "#3b82f6"
  },
  {
    title: "Healthcare Camps",
    description: "Organizing free medical checkups, providing essential medicines, and raising health awareness in rural communities.",
    image: "/healthcare.jpg",
    color: "#10b981"
  },
  {
    title: "Women Empowerment",
    description: "Skill development and micro-finance support to help women become financially independent and leaders in their communities.",
    image: "/women.jpg",
    color: "#d946ef"
  },
  {
    title: "Community Outreach",
    description: "Building resilient communities through disaster relief, food distribution, and sustainable livelihood programs.",
    image: "/outreach.jpg",
    color: "#f59e0b"
  },
  {
    title: "Skill Development",
    description: "Equipping the youth with modern vocational skills, computer training, and career counseling to increase employability.",
    image: "/education.jpg",
    color: "#6366f1"
  },
  {
    title: "Environment Protection",
    description: "Conducting large-scale plantation drives, waste management awareness, and sustainable agricultural practices.",
    image: "/hero.jpg",
    color: "#84cc16"
  },
  {
    title: "Rural & Community Development",
    description: "Supporting sustainable rural development through livelihood promotion, sanitation, infrastructure, clean drinking water, and community capacity building.",
    image: "/rural_development.jpg",
    color: "#14b8a6"
  },
  {
    title: "Child Welfare & Protection",
    description: "Ensuring every child has access to education, healthcare, nutrition, protection, and a safe, nurturing environment.",
    image: "/child_welfare.jpg",
    color: "#f43f5e"
  },
  {
    title: "Social Inclusion & Community Welfare",
    description: "Empowering marginalized communities, senior citizens, persons with disabilities, and economically weaker sections through inclusive development programs.",
    image: "/social_inclusion.jpg",
    color: "#8b5cf6"
  },
  {
    title: "Research, Awareness & Advocacy",
    description: "Conducting research and advocacy campaigns to raise awareness about important social issues, mobilize resources, and drive policy changes.",
    image: "/research_advocacy.jpg?v=2",
    color: "#f97316"
  }
];

const Programs = () => {
  return (
    <section id="programs" className="section" style={{ background: 'var(--surface)', position: 'relative' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center" 
          style={{ marginBottom: '4rem' }}
        >
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
          {programs.map((program, index) => (
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
                background: 'var(--bg-color)',
                border: '1px solid var(--border)',
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .ngo-program-card {
          transition: all 0.4s ease;
        }
        .ngo-program-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2);
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
