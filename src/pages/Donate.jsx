import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Donate = () => {
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAmountSelect = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount('custom');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = amount === 'custom' ? customAmount : amount;
    if (!finalAmount || Number(finalAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    alert(`Processing donation of ₹${finalAmount}. Thank you for your support!`);
    // Here you would typically integrate a payment gateway like Razorpay or Stripe
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      position: 'relative',
      paddingTop: '100px',
      paddingBottom: '4rem',
      color: 'white'
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)', zIndex: 0
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent', border: 'none', color: '#94a3b8',
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
              fontSize: '1rem', transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'white'}
            onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.75rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Empower a Life Today
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
            Your generous contribution helps us provide education, healthcare, and livelihood to those who need it most.
          </p>
        </motion.div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'
        }}>
          
          {/* Donation Amount Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(20px)',
              borderRadius: '24px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Select Amount</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { value: '500', label: '₹ 500' },
                { value: '1000', label: '₹ 1,000' },
                { value: '2500', label: '₹ 2,500' },
                { value: '5000', label: '₹ 5,000' }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAmountSelect(opt.value)}
                  style={{
                    padding: '1rem', borderRadius: '12px', fontSize: '1.125rem', fontWeight: 600,
                    background: amount === opt.value ? 'linear-gradient(135deg, #3b82f6, #10b981)' : 'rgba(255,255,255,0.05)',
                    color: 'white', border: amount === opt.value ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer', transition: 'all 0.3s'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Or Enter Custom Amount (₹)</label>
              <input 
                type="number" 
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={handleCustomAmount}
                style={{
                  width: '100%', padding: '1rem 1.25rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)', border: amount === 'custom' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', fontSize: '1.125rem', outline: 'none'
                }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✓ All donations are eligible for tax exemption under 80G.
            </p>
          </motion.div>

          {/* Donor Details Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px', padding: '2.5rem', color: '#0f172a',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>Donor Details</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>First Name *</label>
                  <input type="text" required style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outlineColor: '#3b82f6' }} placeholder="John" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Last Name *</label>
                  <input type="text" required style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outlineColor: '#3b82f6' }} placeholder="Doe" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Email Address *</label>
                <input type="email" required style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outlineColor: '#3b82f6' }} placeholder="john@example.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>Phone Number *</label>
                <input type="tel" required style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outlineColor: '#3b82f6' }} placeholder="+91 90000 00000" />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#475569' }}>PAN Number (Optional, for tax receipt)</label>
                <input type="text" style={{ width: '100%', padding: '0.875rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', textTransform: 'uppercase', outlineColor: '#3b82f6' }} placeholder="ABCDE1234F" />
              </div>

              <button type="submit" style={{ 
                width: '100%', padding: '1rem', borderRadius: '12px', marginTop: '1rem',
                background: '#0f172a', color: 'white', fontSize: '1.125rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.5)', transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Proceed to Pay ₹{amount === 'custom' ? (customAmount || '0') : amount} <CreditCard size={20} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Donate;
