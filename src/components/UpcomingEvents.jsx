import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events?upcoming=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || events.length === 0) {
    return null; // Gracefully hidden if no upcoming events are published yet
  }

  return (
    <section id="events" className="section" style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #051d11 0%, #082d1a 50%, #04190d 100%)',
      color: '#ffffff',
      overflow: 'hidden',
      padding: '5rem 0'
    }}>
      {/* Ambient Glows */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px',
        background: 'radial-gradient(circle, rgba(238, 163, 40, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%', width: '480px', height: '480px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        filter: 'blur(90px)', pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: '3.5rem' }}
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
            <Sparkles size={14} style={{ color: '#eea328' }} />
            <span style={{ color: '#eea328', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              COMMUNITY IN ACTION
            </span>
          </div>

          <h2 className="section-title" style={{ color: '#ffffff' }}>Upcoming NGO Events & Medical Drives</h2>
          <p className="section-subtitle" style={{ color: '#c5e4d2' }}>
            Join our upcoming ground activities, free diagnostic health camps, and volunteer-led community drives.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {events.map((event, idx) => {
            const eventDate = new Date(event.event_date);
            const monthStr = eventDate.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
            const dayStr = eventDate.getDate();

            return (
              <motion.div
                key={event.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
                }}
                className="event-card-hover"
              >
                {/* Image + Date Badge */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img
                    src={event.cover_image || '/healthcare.jpg'}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(6, 40, 23, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(238, 163, 40, 0.4)',
                    borderRadius: '14px',
                    padding: '0.4rem 0.85rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#eea328', lineHeight: 1 }}>{dayStr}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ffffff', letterSpacing: '1px' }}>{monthStr}</div>
                  </div>

                  {event.program_title && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(238, 163, 40, 0.2)',
                      border: '1px solid rgba(238, 163, 40, 0.4)',
                      backdropFilter: 'blur(8px)',
                      color: '#eea328',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '20px'
                    }}>
                      {event.program_title}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>
                  
                  <p style={{ color: '#c5e4d2', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                    {event.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
                      <MapPin size={15} style={{ color: '#eea328', flexShrink: 0 }} />
                      <span>{event.location}</span>
                    </div>
                    {event.start_time && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                        <Clock size={15} style={{ color: '#eea328', flexShrink: 0 }} />
                        <span>{event.start_time} {event.end_time ? `- ${event.end_time}` : ''}</span>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/inquiry?role=Volunteer&event=${encodeURIComponent(event.title)}`}
                    className="btn btn-gold"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      borderRadius: '12px'
                    }}
                  >
                    <span>Volunteer for This Event</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .event-card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(238, 163, 40, 0.45) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
        }
      `}</style>
    </section>
  );
};

export default UpcomingEvents;
