import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [submissions, setSubmissions] = useState([]);

  const loadData = () => {
    const localSubs = JSON.parse(localStorage.getItem('vyasaprep_submissions') || '[]');
    fetch('/api/student/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const apiSubs = (data && Array.isArray(data.examHistory)) ? data.examHistory : [];
        const merged = [...localSubs, ...apiSubs];
        const unique = Array.from(new Map(merged.map(item => [item.id || item.submitted_at || item.exam_name, item])).values());
        setSubmissions(unique);
      })
      .catch(() => {
        setSubmissions(localSubs);
      });
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('exam-submitted', handleUpdate);
    window.addEventListener('exam-completed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      window.removeEventListener('exam-submitted', handleUpdate);
      window.removeEventListener('exam-completed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  const totalExams = submissions.length;
  const avgScore = totalExams > 0
    ? Math.round(submissions.reduce((acc, s) => acc + (s.percentage !== undefined ? s.percentage : (s.score || 0)), 0) / totalExams)
    : 0;
  const totalQuestions = submissions.reduce((acc, s) => acc + (s.total_marks || 60), 0);

  return (
    <main style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Dashboard</h1>
        <p style={{ color: 'var(--muted)' }}>Welcome back! Here's your study progress.</p>
      </header>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="section-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Exams Taken</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>{totalExams}</div>
        </div>
        <div className="section-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Avg. Score</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--green-l)' }}>{avgScore}%</div>
        </div>
        <div className="section-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Global Rank</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--purple-l)' }}>—</div>
        </div>
        <div className="section-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Questions Attempted</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--blue-l)' }}>{totalQuestions}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Content Area */}
        <div className="section-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>Recent Performance</h2>
          {totalExams === 0 ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--s2)', borderRadius: 'var(--r)' }}>
              <p style={{ color: 'var(--muted)' }}>No exam submissions recorded yet. Take an exam to see your chart.</p>
            </div>
          ) : (
            <div style={{ padding: '16px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {submissions.map((sub, idx) => (
                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                    <span>{sub.exam_name || sub.subject || 'Mock Exam'}</span>
                    <strong style={{ color: 'var(--green-l)' }}>{sub.score || 0} / {sub.total_marks || 60} ({sub.percentage || 0}%)</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="section-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '16px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/exam" className="btn-primary" style={{ textAlign: 'center' }}>Take New Exam</Link>
            <Link to="/syllabus" className="btn-outline" style={{ textAlign: 'center' }}>View Syllabus</Link>
          </div>

          <h2 style={{ marginTop: '32px', marginBottom: '16px', fontSize: '1.1rem' }}>Subject Strength</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Physics</span><span style={{ color: 'var(--muted)' }}>{totalExams > 0 ? 'Evaluated' : '—'}</span></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Chemistry</span><span style={{ color: 'var(--muted)' }}>{totalExams > 0 ? 'Evaluated' : '—'}</span></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Mathematics</span><span style={{ color: 'var(--muted)' }}>{totalExams > 0 ? 'Evaluated' : '—'}</span></li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Biology</span><span style={{ color: 'var(--muted)' }}>{totalExams > 0 ? 'Evaluated' : '—'}</span></li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default StudentDashboard;
