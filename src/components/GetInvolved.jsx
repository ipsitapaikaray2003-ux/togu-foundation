import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Heart, Handshake, Building2, BadgeCheck } from 'lucide-react';

const roles = [
  { title: "Become a Member", icon: <BadgeCheck size={32} />, desc: "Join our core team and help shape the future of our initiatives." },
  { title: "Volunteer", icon: <UserPlus size={32} />, desc: "Offer your time and skills to make a direct impact on the ground." },
  { title: "Donor", icon: <Heart size={32} />, desc: "Support our causes financially to expand our reach and effectiveness." },
  { title: "CSR Partner", icon: <Building2 size={32} />, desc: "Collaborate with us to fulfill your corporate social responsibility goals." },
  { title: "Community Partner", icon: <Handshake size={32} />, desc: "Work together with us to uplift local communities." }
];

const GetInvolved = () => {
  const navigate = useNavigate();

  const handleApplyClick = (roleTitle) => {
    navigate(`/inquiry?role=${encodeURIComponent(roleTitle)}`);
  };

  return (
    <section id="get-involved" className="section" style={{ background: 'var(--bg-alt)', position: 'relative' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '4rem' }}
        >
          <h2 className="section-title" style={{ color: 'var(--text-alt)' }}>Get Involved</h2>
          <p className="section-subtitle" style={{ color: 'var(--text-alt-muted)' }}>
            There are many ways you can contribute to our mission. Join hands with us and be a part of the change.
          </p>
        </motion.div>

        {/* Changed from Grid to Flex to center the last row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              style={{
                background: 'var(--surface)',
                padding: '2.5rem 2rem',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '350px',
                flex: '1 1 300px'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                color: 'white',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {role.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)' }}>{role.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', flex: 1 }}>{role.desc}</p>
              <button 
                onClick={() => handleApplyClick(role.title)}
                className="btn btn-outline" 
                style={{ width: '100%' }}
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
