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

  const [submitting, setSubmitting] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const finalAmount = amount === 'custom' ? customAmount : amount;
    if (!finalAmount || Number(finalAmount) <= 0) {
      setErrorMsg("Please enter a valid amount.");
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const firstName = formData.get('firstName')?.trim();
    const lastName = formData.get('lastName')?.trim();
    const donorName = `${firstName} ${lastName}`.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const pan = formData.get('pan')?.trim() || '';

    try {
      setSubmitting(true);
      const res = await fetch('/api/donations/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: donorName,
          donor_email: email,
          donor_phone: phone,
          amount: Number(finalAmount),
          currency: 'INR',
          payment_method: 'Direct Bank / UPI Pledge',
          notes: `Public website donation pledge. Donor PAN: ${pan || 'Not provided'}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Donation pledge could not be recorded');

      setPledgeSuccess({
        id: data.donationId,
        amount: finalAmount,
        donorName,
        email
      });
      form.reset();
    } catch (err) {
      setErrorMsg(err.message || 'Server error while saving donation pledge.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #051a0e 0%, #0b341f 100%)',
      position: 'relative',
      paddingTop: '100px',
      paddingBottom: '4rem',
      color: 'white'
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(238,163,40,0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)', zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(11,75,37,0.35) 0%, rgba(0,0,0,0) 70%)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(238, 163, 40, 0.2)', color: '#eea328', padding: '0.75rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #4ade80, #eea328)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-heading)' }}>
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
              background: 'rgba(11, 38, 24, 0.75)', backdropFilter: 'blur(20px)',
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
                    background: amount === opt.value ? 'linear-gradient(135deg, #0b4b25, #eea328)' : 'rgba(255,255,255,0.05)',
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
                  background: 'rgba(255,255,255,0.05)', border: amount === 'custom' ? '2px solid #eea328' : '1px solid rgba(255,255,255,0.2)',
                  color: 'white', fontSize: '1.125rem', outline: 'none'
                }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>Donor Details</h3>

            {pledgeSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🙏</div>
                <h4 style={{ color: '#065f46', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Pledge Recorded: ₹{pledgeSuccess.amount}
                </h4>
                <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Thank you <strong>{pledgeSuccess.donorName}</strong>! Your donation record #{pledgeSuccess.id} has been logged in our system.
                </p>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>Direct Bank / UPI Transfer Details:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: '#334155' }}>
                    <div><strong>A/C Name:</strong> TOGU Foundation</div>
                    <div><strong>Bank:</strong> State Bank of India</div>
                    <div><strong>A/C No:</strong> 382901239840</div>
                    <div><strong>IFSC Code:</strong> SBIN0004523</div>
                    <div style={{ gridColumn: 'span 2' }}><strong>UPI ID:</strong> togufoundation@sbi</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  Once your transfer is complete, our finance team will verify the payment and email your official tax-exemption receipt to <strong>{pledgeSuccess.email}</strong>.
                </div>

                <button
                  onClick={() => setPledgeSuccess(null)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#1e293b',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Make Another Donation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {errorMsg && (
                  <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', color: '#b91c1c', fontSize: '0.88rem' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>First Name *</label>
                    <input type="text" name="firstName" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outlineColor: '#0b4b25' }} placeholder="John" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Last Name *</label>
                    <input type="text" name="lastName" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outlineColor: '#0b4b25' }} placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Email Address *</label>
                  <input type="email" name="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outlineColor: '#0b4b25' }} placeholder="john@example.com" />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Phone Number *</label>
                  <input type="tel" name="phone" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outlineColor: '#0b4b25' }} placeholder="+91 90000 00000" />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>PAN Number (Optional, for 80G tax receipt)</label>
                  <input type="text" name="pan" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', textTransform: 'uppercase', outlineColor: '#0b4b25' }} placeholder="ABCDE1234F" />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ 
                    width: '100%', padding: '0.9rem', borderRadius: '12px', marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, #eea328 0%, #d98f18 100%)', color: '#062817', fontSize: '1.05rem', fontWeight: 700,
                    border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    boxShadow: '0 10px 25px -5px rgba(238, 163, 40, 0.45)', opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Recording Donation...' : `Pledge Donation of ₹${amount === 'custom' ? (customAmount || '0') : amount}`} <CreditCard size={18} />
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Donate;
