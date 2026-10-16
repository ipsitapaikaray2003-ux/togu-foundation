import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your login details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #051d11 0%, #062817 50%, #03130b 100%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(238, 163, 40, 0.12) 0%, transparent 70%)',
        top: '-10%',
        right: '-5%',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        bottom: '-15%',
        left: '-10%',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            padding: '8px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            marginBottom: '1rem'
          }}>
            <img src="/logo-icon.png" alt="TOGU" style={{ height: '48px', width: 'auto' }} />
          </div>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.25rem 0',
            letterSpacing: '0.5px'
          }}>
            TOGU <span style={{ color: '#eea328' }}>FOUNDATION</span>
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: '#a3c2b0',
            margin: 0,
            fontWeight: 500
          }}>
            Admin & Management Portal Login
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: '#fca5a5',
            fontSize: '0.875rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@togufoundation.org"
                autoComplete="username"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.85rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                className="login-input"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', color: '#94a3b8', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 2.85rem 0.8rem 2.85rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #eea328 0%, #d48b17 100%)',
              color: '#062817',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 18px rgba(238, 163, 40, 0.35)',
              transition: 'all 0.2s',
              opacity: loading ? 0.75 : 1
            }}
            className="login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security Assurance Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          marginTop: '1.75rem',
          color: '#82a592',
          fontSize: '0.78rem'
        }}>
          <Shield size={14} style={{ color: '#eea328' }} />
          <span>Encrypted Session • Role-Based Protected Portal</span>
        </div>


        {/* Back to Site link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <a
            href="/"
            style={{
              color: '#a3c2b0',
              fontSize: '0.825rem',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            className="back-link"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>

      <style>{`
        .login-input:focus {
          border-color: #eea328 !important;
          background: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 0 14px rgba(238, 163, 40, 0.25) !important;
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(238, 163, 40, 0.45);
        }
        .back-link:hover {
          color: #eea328 !important;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
