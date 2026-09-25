import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, HeartHandshake } from 'lucide-react';
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
    { name: 'Structure', href: '/#structure' },
    { name: 'Get Involved', href: '/#get-involved' },
  ];

  // If on home page and not scrolled, text should be white to contrast with dark hero
  const textColor = (!scrolled && isHomePage) ? '#ffffff' : 'inherit';
  const logoTextColor = (!scrolled && isHomePage) ? '#ffffff' : 'var(--text-main)';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s ease',
      background: scrolled ? (isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)') : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}` : '1px solid transparent',
      padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      color: textColor
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: logoTextColor }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
            borderRadius: '50%', padding: '0.5rem', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <HeartHandshake size={24} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            TOGU <span className="gradient-text">Foundation</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <ul style={{ display: 'flex', gap: '2rem' }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                {link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link to={link.href} style={{ fontWeight: 500, transition: 'color 0.3s' }} className="nav-link">
                    {link.name}
                  </Link>
                ) : (
                  <a href={link.href} style={{ fontWeight: 500, transition: 'color 0.3s' }} className="nav-link">
                    {link.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/donate" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Donate Now
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-nav-toggle">
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}>
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
              background: isDarkMode ? '#1e293b' : '#ffffff',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              overflow: 'hidden'
            }}
          >
            <ul style={{ padding: '1rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link to={link.href} onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '0.5rem 0', fontWeight: 500 }}>
                      {link.name}
                    </Link>
                  ) : (
                    <a href={link.href} onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '0.5rem 0', fontWeight: 500 }}>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
              <li style={{ paddingTop: '1rem' }}>
                <Link to="/donate" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                  Donate Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
        }
        .nav-link:hover { color: var(--secondary) !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;
