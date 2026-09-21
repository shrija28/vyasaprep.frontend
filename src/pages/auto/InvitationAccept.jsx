import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const InvitationAccept = () => {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('code') || searchParams.get('token') || '';
  
  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyInvite = async () => {
      setLoading(true);
      setError('');
      if (!inviteCode) {
        setError('No invitation code provided in the link.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/institution/invitations/info?code=${encodeURIComponent(inviteCode)}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setInvitationData(data);
        } else {
          // Fallback info if verification endpoint is simple or token is embedded
          setInvitationData({
            institution_name: 'Partner Institution',
            invite_code: inviteCode
          });
        }
      } catch {
        setInvitationData({
          institution_name: 'Partner Institution',
          invite_code: inviteCode
        });
      } finally {
        setLoading(false);
      }
    };

    verifyInvite();
  }, [inviteCode]);

  const handleAccept = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/institution/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: inviteCode, invite_code: inviteCode })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/student/institution');
        }, 1500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Failed to accept invitation. You may need to sign in first.');
      }
    } catch {
      setError('Network error while processing invitation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-mesh"></div>

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '20px' }}>
        <section className="section-card" style={{ maxWidth: '520px', width: '100%', padding: '32px' }}>
          <h1 id="invitationTitle" style={{ marginBottom: '8px' }}>Institution Invitation</h1>
          <p className="input-label" style={{ marginBottom: '24px', textTransform: 'none', fontSize: '0.9rem' }}>
            Review the invitation details below and choose to accept or decline.
          </p>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid var(--red)', borderRadius: 'var(--rs)', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--red-l)' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid var(--green)', borderRadius: 'var(--rs)', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--green-l)' }}>
              Invitation accepted successfully! Redirecting to institution portal…
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
              Loading invitation details…
            </div>
          ) : (
            <section id="invitationDetails">
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <span className="input-label">Institution</span>
                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text)', margin: '0' }}>
                  {invitationData?.institution_name || 'VyasaPrep Institution'}
                </p>
              </div>

              {inviteCode && (
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <span className="input-label">Invite Code</span>
                  <p style={{ fontSize: '0.95rem', color: 'var(--purple-l)', fontWeight: 600, margin: '0' }}>
                    {inviteCode}
                  </p>
                </div>
              )}

              <div className="input-group" style={{ marginBottom: '24px' }}>
                <span className="input-label">What You'll Get</span>
                <ul style={{ margin: '8px 0 0', paddingLeft: '20px', color: 'var(--text)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <li>Access to your institution's curated exams</li>
                  <li>Personalized analytics and batch rankings</li>
                  <li>Full access to your institution's prep portal</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleAccept}
                  disabled={submitting || success}
                  style={{ flex: '1', minWidth: '140px', justifyContent: 'center' }}
                >
                  {submitting ? 'Accepting…' : 'Accept Invitation'}
                </button>
                <Link
                  to="/"
                  className="btn-outline"
                  style={{ flex: '1', minWidth: '140px', justifyContent: 'center', textAlign: 'center', textDecoration: 'none' }}
                >
                  Decline
                </Link>
              </div>
            </section>
          )}
        </section>
      </main>
    </>
  );
};

export default InvitationAccept;
