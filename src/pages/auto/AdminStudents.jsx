import React, { useState, useEffect } from 'react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const list = data.students || (Array.isArray(data) ? data : []);
        setStudents(list);
      } else {
        setStudents([]);
      }
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => {
    if (filterType === 'institution') return s.student_type === 'institutional' || !!s.institution_name;
    if (filterType === 'direct') return s.student_type === 'direct' || !s.institution_name;
    return true;
  });

  const totalCount = students.length;
  const instCount = students.filter(s => s.student_type === 'institutional' || !!s.institution_name).length;
  const directCount = totalCount - instCount;
  const activeSubCount = students.filter(s => s.subscription_status === 'active' || s.subscription_status === 'pro').length;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .main-wrap { max-width: 100%; }
        .tab-group { display: flex; gap: 0; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
        .tab-btn { padding: 12px 16px; background: transparent; border: none; color: var(--muted); cursor: pointer; font-size: 0.88rem; font-weight: 600; transition: all 0.2s; border-bottom: 2px solid transparent; margin-bottom: -1px; }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active { color: var(--purple-l, #a78bfa); border-bottom-color: var(--purple-l, #a78bfa); }
        .student-table { table-layout: fixed; width: 100%; border-collapse: collapse; }
        .sub-badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
        .sub-badge.active { background: rgba(5, 150, 105, 0.15); color: var(--green-l); }
        .sub-badge.no_subscription { background: rgba(107, 114, 128, 0.1); color: var(--muted2); }
      ` }} />

      <div className="bg-mesh"></div>

      <div className="main-wrap" style={{ maxWidth: '100%', padding: '24px 28px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 3px' }}>Students Management</h1>
            <p style={{ color: 'var(--muted)', margin: '0', fontSize: '0.82rem' }}>View and manage all students — institution-linked and direct subscribers</p>
          </div>
          <button className="btn-outline" onClick={fetchStudents} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--purple-l,#a78bfa)' }}>{totalCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total Students</div>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--blue-l,#60a5fa)' }}>{instCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Institution-linked</div>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--purple-l,#a78bfa)' }}>{directCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Direct Subscribers</div>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--green-l)' }}>{activeSubCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Active Subscriptions</div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-card-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '16px' }}>
              <div className="section-icon" style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div style={{ flex: '1' }}>
                <h2 style={{ margin: '0', fontSize: '1.1rem' }}>All Students</h2>
                <p className="section-sub" style={{ margin: '2px 0 0' }}>Enrolled students across institutions and individual plans</p>
              </div>
            </div>

            <div className="tab-group" style={{ width: '100%' }}>
              <button className={`tab-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Students ({totalCount})</button>
              <button className={`tab-btn ${filterType === 'institution' ? 'active' : ''}`} onClick={() => setFilterType('institution')}>Institution-linked ({instCount})</button>
              <button className={`tab-btn ${filterType === 'direct' ? 'active' : ''}`} onClick={() => setFilterType('direct')}>Direct Subscribers ({directCount})</button>
            </div>
          </div>

          <div className="section-body" style={{ padding: '0' }}>
            <div className="table-scroll" style={{ overflowX: 'auto' }}>
              <table className="results-table student-table">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Student ID</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Type</th>
                    <th style={{ padding: '12px 16px' }}>Institution</th>
                    <th style={{ padding: '12px 16px' }}>Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>Loading students...</td></tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>No students recorded yet.</td></tr>
                  ) : (
                    filteredStudents.map((stu, i) => (
                      <tr key={stu.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{stu.display_name || stu.name || 'Student'}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--purple-l)' }}>{stu.kcet_student_id || stu.student_id || '—'}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{stu.email || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>{stu.institution_name ? 'Institutional' : 'Direct'}</td>
                        <td style={{ padding: '12px 16px' }}>{stu.institution_name || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`sub-badge ${stu.subscription_status === 'active' ? 'active' : 'no_subscription'}`}>
                            {stu.subscription_status || 'Free'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Showing {filteredStudents.length} of {totalCount} students</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminStudents;
