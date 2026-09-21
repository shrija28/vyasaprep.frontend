import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PLANS = [
  {
    key: 'free',
    name: 'Free Access',
    tagline: 'Basic KCET question bank & instant mock tests',
    price: 0,
    saveText: null,
    badge: null,
    badgeClass: '',
    ctaLabel: 'Current Plan',
    ctaClass: 'current',
    disabled: true,
    features: [
      { text: '500+ Practice Questions', active: true },
      { text: 'Standard Mock Tests', active: true },
      { text: 'Basic Score Breakdown', active: true },
      { text: 'AI Rank Predictor', active: false },
      { text: 'Detailed Video Solutions', active: false },
    ]
  },
  {
    key: 'monthly',
    name: 'Monthly Pass',
    tagline: 'Full feature access for quick revision',
    price: 499,
    per: '/month',
    saveText: 'SAVE 20%',
    badge: 'POPULAR',
    badgeClass: '',
    ctaLabel: 'Upgrade Now →',
    ctaClass: 'primary',
    features: [
      { text: '10,000+ KCET Question Bank', active: true },
      { text: 'Unlimited Mock & Weekly Tests', active: true },
      { text: 'Personalized AI Guidance', active: true },
      { text: 'College Match Predictor', active: true },
      { text: 'Detailed Step-by-Step Solutions', active: true },
    ]
  },
  {
    key: 'pro',
    name: 'Pro Pass (3 Months)',
    tagline: 'Comprehensive preparation for high scorers',
    price: 999,
    per: '/3 months',
    saveText: 'BEST VALUE',
    badge: 'RECOMMENDED',
    badgeClass: '',
    ctaLabel: 'Get Pro Pass →',
    ctaClass: 'primary',
    featured: true,
    features: [
      { text: 'All Monthly Pass Features', active: true },
      { text: 'Priority AI Recommendations', active: true },
      { text: 'Topic-wise Rank Booster', active: true },
      { text: 'Previous 10 Years KCET Papers', active: true },
      { text: '1-on-1 Performance Analytics', active: true },
    ]
  },
  {
    key: 'annual',
    name: 'Annual Unlimited',
    tagline: 'Complete 1-Year access for KCET 2026',
    price: 1999,
    per: '/year',
    saveText: 'SAVE 60%',
    badge: 'SUPER SAVER',
    badgeClass: 'pc-trial-badge',
    ctaLabel: 'Get Annual Access →',
    ctaClass: 'trial',
    features: [
      { text: 'Everything in Pro Pass', active: true },
      { text: 'Unlimited Retakes & Custom Sets', active: true },
      { text: 'Full Institution Dashboard Integration', active: true },
      { text: '24/7 Expert Doubt Support', active: true },
      { text: 'Guaranteed Score Improvement Plan', active: true },
    ]
  }
];

const StudentPricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSelectPlan = (plan) => {
    if (plan.disabled) return;
    setSelectedPlan(plan);
    setPayModalOpen(true);
    setStatusMsg('');
  };

  const handlePayNow = () => {
    if (!selectedPlan) return;
    setProcessing(true);
    setStatusMsg('Processing secure payment via Razorpay...');

    setTimeout(() => {
      setProcessing(false);
      setStatusMsg(`🎉 Payment successful! You are now subscribed to ${selectedPlan.name}.`);
      setTimeout(() => {
        setPayModalOpen(false);
        navigate('/dashboard');
      }, 1800);
    }, 1200);
  };

  return (
    <>
      <div className="bg-mesh"></div>

      <main style={{ paddingBottom: '60px' }}>
        <div className="ph" style={{ textAlign: 'center', padding: '52px 20px 32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '10px' }}>
            Unlock Your <span style={{ background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KCET Success</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: 0 }}>
            Choose the plan that fits your preparation style. Start free, upgrade anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="pg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', maxWidth: '1060px', margin: '0 auto 40px', padding: '0 24px' }}>
          {PLANS.map((plan) => (
            <div key={plan.key} className={`pc ${plan.featured ? 'featured' : ''}`} style={{ background: 'var(--card)', border: plan.featured ? '2px solid var(--purple-l)' : '1px solid var(--border)', borderRadius: '16px', padding: '28px 22px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              {plan.badge && (
                <span className={`pc-badge ${plan.badgeClass}`} style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg,#a78bfa,#60a5fa)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </span>
              )}

              <div className="pc-name" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px', color: 'var(--text)' }}>
                {plan.name}
              </div>
              <div className="pc-tagline" style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '16px', minHeight: '36px' }}>
                {plan.tagline}
              </div>

              <div className="pc-price" style={{ marginBottom: '6px' }}>
                <span className="sym" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>₹</span>
                <span className="amt" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)' }}>{plan.price}</span>
                {plan.per && <span className="per" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginLeft: '4px' }}>{plan.per}</span>}
              </div>

              {plan.saveText ? (
                <span className="pc-save" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-l)', background: 'rgba(5,150,105,0.15)', padding: '2px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px' }}>
                  {plan.saveText}
                </span>
              ) : (
                <div style={{ height: '22px', marginBottom: '16px' }}></div>
              )}

              <ul className="pc-feats" style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map((f, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: f.active ? 'var(--text)' : 'var(--muted)', opacity: f.active ? 1 : 0.5 }}>
                    <span>{f.active ? '✅' : '❌'}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`pc-cta ${plan.ctaClass}`}
                disabled={plan.disabled}
                onClick={() => handleSelectPlan(plan)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 700, cursor: plan.disabled ? 'default' : 'pointer', border: 'none', background: plan.disabled ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg,#a78bfa,#6366f1)', color: '#fff' }}
              >
                {plan.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          🔒 Secured by Razorpay · Instant activation · Cancel anytime
        </p>
      </main>

      {/* Payment Modal */}
      {payModalOpen && selectedPlan && (
        <div className="pmo" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
          <div className="pmd" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '90%', position: 'relative' }}>
            <button type="button" className="pmo-close" onClick={() => setPayModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.4rem' }}>
              ✕
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px' }}>Confirm Subscription</h3>
            <div className="pmo-sub" style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Upgrading to <strong>{selectedPlan.name}</strong>
            </div>

            <div className="pmo-amt" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--purple-l)', marginBottom: '20px' }}>
              ₹{selectedPlan.price} <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{selectedPlan.per}</span>
            </div>

            <div className="pmo-methods" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              <span className="pm-badge" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)' }}>📱 UPI</span>
              <span className="pm-badge" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)' }}>💳 Cards</span>
              <span className="pm-badge" style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)' }}>🏦 Net Banking</span>
            </div>

            {statusMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: statusMsg.includes('successful') ? 'rgba(5,150,105,0.15)' : 'rgba(124,58,237,0.15)', color: statusMsg.includes('successful') ? 'var(--green-l)' : 'var(--purple-l)', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                {statusMsg}
              </div>
            )}

            <div className="pmo-actions" style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="pc-cta outline"
                onClick={() => setPayModalOpen(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'none', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pc-cta primary"
                disabled={processing}
                onClick={handlePayNow}
                style={{ flex: 2, padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg,#a78bfa,#6366f1)', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                {processing ? 'Processing...' : 'Pay Now →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentPricing;
