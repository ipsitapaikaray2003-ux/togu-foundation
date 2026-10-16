import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, HeartHandshake, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Healthcare', href: '/healthcare' },
    { name: 'About Us', href: '/#about' },
    { name: 'Focus Areas', href: '/#focus-areas' },
    { name: 'Events', href: '/#events' },
    { name: 'Structure', href: '/#structure' },
    { name: 'Get Involved', href: '/#get-involved' },
  ];

  const handleNavClick = (e, href) => {
    if (href.includes('#')) {
      const targetId = href.split('#')[1];
      if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `#${targetId}`);
        }
      }
    }
    if (isOpen) {
      setIsOpen(false);
    }
  };

  // Always use crisp white text against the rich brand green background
  const textColor = '#ffffff';
  const logoTextColor = '#ffffff';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s ease',
      background: 'linear-gradient(135deg, rgba(6, 40, 23, 0.97) 0%, rgba(11, 75, 37, 0.95) 50%, rgba(7, 53, 26, 0.97) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(238, 163, 40, 0.35)',
      boxShadow: scrolled ? '0 8px 30px rgba(0, 0, 0, 0.28)' : '0 4px 20px rgba(0, 0, 0, 0.15)',
      padding: scrolled ? '0.65rem 0' : '0.9rem 0',
      color: textColor
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: '0 1.5rem', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Left: Brand / Logo */}
        <div style={{ flex: '1 0 0', display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <Link to="/" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            color: logoTextColor, 
            textDecoration: 'none',
            flexShrink: 0 
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              padding: '4px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}>
              <img 
                src="/logo-icon.png" 
                alt="TOGU Emblem" 
                style={{ 
                  height: scrolled ? '36px' : '40px', 
                  width: 'auto', 
                  display: 'block', 
                  transition: 'all 0.3s ease' 
                }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, flexShrink: 0 }}>
              <div style={{ 
                fontSize: scrolled ? '1.2rem' : '1.35rem', 
                fontWeight: 800, 
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.35rem',
                transition: 'all 0.3s ease'
              }}>
                <span style={{ color: '#ffffff' }}>TOGU</span>
                <span style={{ color: '#eea328', fontWeight: 800 }}>FOUNDATION</span>
              </div>
              <span style={{ 
                fontSize: '0.52rem', 
                letterSpacing: '1px', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                color: 'rgba(255, 255, 255, 0.85)' 
              }}>
                Together for Good • United for Change
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Navigation Links in the Center */}
        <div className="desktop-nav-center" style={{ 
          display: 'none', 
          alignItems: 'center', 
          justifyContent: 'center',
          flex: '0 0 auto'
        }}>
          <ul style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            margin: 0, 
            padding: 0, 
            listStyle: 'none' 
          }}>
            {navLinks.map((link) => (
              <li key={link.name} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link 
                    to={link.href} 
                    className="nav-link"
                    style={{ 
                      fontWeight: 600, 
                      fontSize: '0.925rem',
                      whiteSpace: 'nowrap',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="nav-link"
                    style={{ 
                      fontWeight: 600, 
                      fontSize: '0.925rem',
                      whiteSpace: 'nowrap',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Desktop Actions (Theme Toggle, Admin & Donate Button) */}
        <div className="desktop-actions" style={{ 
          display: 'none', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          gap: '0.75rem', 
          flex: '1 0 0',
          minWidth: 0
        }}>
          <button onClick={toggleTheme} aria-label="Toggle Theme" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', padding: '0.35rem' }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Admin Portal Button */}
          <Link 
            to="/admin" 
            title="Admin Portal"
            className="nav-admin-btn"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.45rem 0.85rem', 
              borderRadius: '8px', 
              fontSize: '0.825rem', 
              fontWeight: 600, 
              color: '#ffffff', 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.25)', 
              textDecoration: 'none', 
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Shield size={14} style={{ color: '#eea328' }} />
            <span>Admin</span>
          </Link>

          <Link to="/donate" className="btn btn-gold" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Donate Now
          </Link>
        </div>

        {/* Mobile Toggle on Right for small screens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }} className="mobile-nav-toggle">
          <button onClick={toggleTheme} aria-label="Toggle Theme" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Menu" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#062817',
              borderBottom: '1px solid rgba(238, 163, 40, 0.35)',
              color: '#ffffff',
              overflow: 'hidden'
            }}
          >
            <ul style={{ padding: '1.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link to={link.href} onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '0.5rem 0', fontWeight: 600, color: '#ffffff' }}>
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} onClick={(e) => handleNavClick(e, link.href)} style={{ display: 'block', padding: '0.5rem 0', fontWeight: 600, color: '#ffffff' }}>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
              <li style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem', 
                    padding: '0.65rem 1rem', 
                    fontWeight: 600, 
                    fontSize: '0.9rem',
                    color: '#ffffff', 
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textDecoration: 'none'
                  }}
                >
                  <Shield size={16} style={{ color: '#eea328' }} />
                  <span>Admin Portal</span>
                </Link>

                <Link to="/donate" onClick={() => setIsOpen(false)} className="btn btn-gold" style={{ width: '100%', textAlign: 'center' }}>
                  Donate Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav-center { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
        }
        .nav-link {
          color: rgba(255, 255, 255, 0.92) !important;
          white-space: nowrap !important;
          word-break: keep-all !important;
          display: inline-block !important;
          transition: all 0.2s ease !important;
        }
        .nav-link:hover { 
          color: #eea328 !important;
          background: rgba(238, 163, 40, 0.2) !important;
        }
        .nav-admin-btn:hover {
          background: rgba(238, 163, 40, 0.22) !important;
          border-color: #eea328 !important;
          color: #eea328 !important;
          box-shadow: 0 0 12px rgba(238, 163, 40, 0.35) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
