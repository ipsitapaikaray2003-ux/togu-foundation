import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enquiriesApi } from '../services/api';
import {
  LayoutDashboard,
  Users,
  MessageSquareQuote,
  Award,
  Layers,
  CalendarDays,
  HeartHandshake,
  ReceiptText,
  FileEdit,
  Image as GalleryIcon,
  UserCheck,
  BarChart3,
  ShieldAlert,
  History,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newEnquiryCount, setNewEnquiryCount] = useState(0);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch new unread enquiry count for the badge
  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const res = await enquiriesApi.getAll({ status: 'New', limit: 1 });
        if (res.success && res.pagination) {
          setNewEnquiryCount(res.pagination.total);
        }
      } catch {
        // quiet error
      }
    };
    fetchBadge();
    const interval = setInterval(fetchBadge, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out from the Admin Portal?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Volunteers', path: '/admin/volunteers', icon: Users },
    { 
      name: 'Enquiries', 
      path: '/admin/enquiries', 
      icon: MessageSquareQuote, 
      badge: newEnquiryCount > 0 ? newEnquiryCount : null 
    },
    { name: 'Members', path: '/admin/members', icon: Award },
    { name: 'Programs', path: '/admin/programs', icon: Layers },
    { name: 'Events', path: '/admin/events', icon: CalendarDays },
    { 
      name: 'Donations', 
      path: '/admin/donations', 
      icon: HeartHandshake,
      requiresRole: ['Super Admin', 'Admin']
    },
    { 
      name: 'Expenses', 
      path: '/admin/expenses', 
      icon: ReceiptText,
      requiresRole: ['Super Admin', 'Admin']
    },
    { 
      name: 'Website Content', 
      path: '/admin/content', 
      icon: FileEdit,
      requiresRole: ['Super Admin', 'Admin']
    },
    { name: 'Gallery', path: '/admin/gallery', icon: GalleryIcon },
    { name: 'Team', path: '/admin/team', icon: UserCheck },
    { 
      name: 'Reports', 
      path: '/admin/reports', 
      icon: BarChart3,
      requiresRole: ['Super Admin', 'Admin']
    },
    { 
      name: 'Admin Users', 
      path: '/admin/users', 
      icon: ShieldAlert,
      requiresRole: ['Super Admin']
    },
    { 
      name: 'Activity Logs', 
      path: '/admin/activity-logs', 
      icon: History,
      requiresRole: ['Super Admin', 'Admin']
    }
  ];

  // Filter items by role
  const visibleNavItems = navItems.filter(item => {
    if (!item.requiresRole) return true;
    return hasRole(...item.requiresRole);
  });

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Super Admin':
        return { background: 'rgba(238, 163, 40, 0.2)', color: '#eea328', border: '1px solid rgba(238, 163, 40, 0.4)' };
      case 'Admin':
        return { background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)' };
      default:
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.4)' };
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {/* Sidebar Overlay on Mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 90,
            backdropFilter: 'blur(3px)'
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`admin-sidebar ${mobileMenuOpen ? 'open-mobile' : ''}`}
        style={{
          width: sidebarOpen ? '270px' : '82px',
          background: 'linear-gradient(180deg, #051d11 0%, #062817 50%, #04170e 100%)',
          color: '#ffffff',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s ease',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.25)',
          borderRight: '1px solid #144028'
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '1.25rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          minHeight: '74px'
        }}>
          {sidebarOpen ? (
            <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{
                background: '#ffffff',
                padding: '4px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <img src="/logo-icon.png" alt="TOGU" style={{ height: '32px', width: 'auto' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
                  TOGU <span style={{ color: '#eea328' }}>ADMIN</span>
                </span>
                <span style={{ fontSize: '0.55rem', color: '#a3c2b0', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Management Portal
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/admin/dashboard" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#ffffff', padding: '4px', borderRadius: '8px' }}>
                <img src="/logo-icon.png" alt="TOGU" style={{ height: '30px', width: 'auto' }} />
              </div>
            </Link>
          )}

          {/* Sidebar Toggle button on desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle-btn"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.4rem',
              color: '#a3c2b0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* User Card in Sidebar (when open) */}
        {sidebarOpen && (
          <div style={{
            margin: '1rem 1rem 0.5rem 1rem',
            padding: '0.85rem 1rem',
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0b4b25, #eea328)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Administrator'}
              </div>
              <div style={{ display: 'inline-block', marginTop: '2px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  ...getRoleBadgeStyle(user?.role)
                }}>
                  {user?.role || 'Staff'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu List */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: sidebarOpen ? '0.75rem 0.75rem 1.5rem 0.75rem' : '0.75rem 0.4rem 1.5rem 0.4rem',
          scrollbarWidth: 'thin'
        }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? (location.pathname === item.path || location.pathname === '/admin')
                : location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    title={!sidebarOpen ? item.name : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: sidebarOpen ? '0.65rem 0.95rem' : '0.7rem 0',
                      justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : '#c5e4d2',
                      background: isActive 
                        ? 'linear-gradient(90deg, rgba(238, 163, 40, 0.22) 0%, rgba(238, 163, 40, 0.08) 100%)' 
                        : 'transparent',
                      borderLeft: isActive ? '3px solid #eea328' : '3px solid transparent',
                      transition: 'all 0.18s ease',
                      position: 'relative'
                    }}
                    className={`nav-item-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={19} style={{ color: isActive ? '#eea328' : '#a3c2b0', flexShrink: 0 }} />
                    {sidebarOpen && (
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                    )}
                    {sidebarOpen && item.badge && (
                      <span style={{
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '10px',
                        marginLeft: 'auto'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {sidebarOpen && (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                color: '#a3c2b0',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                background: 'rgba(255, 255, 255, 0.04)',
                transition: 'all 0.2s'
              }}
              className="view-site-link"
            >
              <ExternalLink size={15} style={{ color: '#eea328' }} />
              <span>Public Website</span>
            </a>
          )}

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: sidebarOpen ? '0.6rem 0.85rem' : '0.6rem 0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              width: '100%',
              transition: 'all 0.2s'
            }}
            className="logout-btn"
            title="Log Out"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '270px' : '82px',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="admin-main-wrapper"
      >
        {/* Top Navbar */}
        <header style={{
          height: '70px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-hamburger-btn"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                color: '#062817'
              }}
              aria-label="Open Mobile Menu"
            >
              <Menu size={24} />
            </button>

            {/* Breadcrumb Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748b' }}>Portal</span>
              <ChevronRight size={14} style={{ color: '#94a3b8' }} />
              <span style={{ fontWeight: 600, color: '#062817', textTransform: 'capitalize' }}>
                {location.pathname.replace('/admin/', '').replace('/admin', 'Dashboard') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#0b4b25',
                background: '#e2efe8',
                border: '1px solid rgba(11, 75, 37, 0.2)',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              className="topbar-website-btn"
            >
              <ExternalLink size={14} />
              <span>Live Website</span>
            </a>

            {/* User pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.75rem',
              background: '#f1f5f9',
              borderRadius: '30px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#0b4b25',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a' }}>
                  {user?.name || 'Admin'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          fontSize: '0.8rem',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <span>&copy; {new Date().getFullYear()} TOGU Foundation NGO Management System. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span>MySQL Database Connected</span>
          </span>
        </footer>
      </div>

      <style>{`
        .nav-item-link:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.25) !important;
        }
        .view-site-link:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #eea328 !important;
        }
        .topbar-website-btn:hover {
          background: #0b4b25 !important;
          color: #ffffff !important;
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
            width: 270px !important;
          }
          .admin-sidebar.open-mobile {
            transform: translateX(0);
          }
          .admin-main-wrapper {
            margin-left: 0 !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
          .sidebar-toggle-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
