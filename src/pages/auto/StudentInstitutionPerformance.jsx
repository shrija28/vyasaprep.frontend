import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MOCK_COLLEGES = {
  target: [
    { name: 'BMS College of Engineering (BMSCE), Bengaluru', branch: 'Computer Science & Engineering', cutoffRank: 1250, location: 'Bengaluru' },
    { name: 'MS Ramaiah Institute of Technology (MSRIT)', branch: 'Information Science & Engineering', cutoffRank: 1840, location: 'Bengaluru' },
    { name: 'RV College of Engineering (RVCE)', branch: 'Electronics & Communication', cutoffRank: 950, location: 'Bengaluru' },
  ],
  reach: [
    { name: 'RV College of Engineering (RVCE)', branch: 'Computer Science & Engineering', cutoffRank: 420, location: 'Bengaluru' },
    { name: 'PES University (Ring Road Campus)', branch: 'Artificial Intelligence & Machine Learning', cutoffRank: 780, location: 'Bengaluru' },
  ],
  safe: [
    { name: 'Dayananda Sagar College of Engineering (DSCE)', branch: 'Computer Science & Engineering', cutoffRank: 3200, location: 'Bengaluru' },
    { name: 'Bangalore Institute of Technology (BIT)', branch: 'Electronics & Communication', cutoffRank: 4500, location: 'Bengaluru' },
    { name: 'Siddaganga Institute of Technology (SIT), Tumakuru', branch: 'Information Science', cutoffRank: 5200, location: 'Tumakuru' },
  ]
};

const StudentInstitutionPerformance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('target');
  const [desiredRankInput, setDesiredRankInput] = useState('');
  const [suggestionsResult, setSuggestionsResult] = useState('');

  const calcRankForScore = (score) => {
    const s = Math.max(0, Math.min(100, Number(score) || 0));
    if (s >= 90) return Math.round(100 + (100 - s) * 240);
    if (s >= 75) return Math.round(2500 + (90 - s) * 366.6);
    if (s >= 60) return Math.round(8000 + (75 - s) * 800);
    if (s >= 45) return Math.round(20000 + (60 - s) * 1666.6);
    return Math.round(45000 + (45 - s) * 1222.2);
  };

  const loadPerformanceData = () => {
    const activeStudentId = localStorage.getItem('vyasaprep_active_student_id') || '';
    const localSubs = JSON.parse(localStorage.getItem('vyasaprep_submissions') || '[]')
      .filter(s => !s.student_id || !activeStudentId || s.student_id === activeStudentId);
    fetch('/api/student/dashboard', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const apiHistory = (data && Array.isArray(data.examHistory)) ? data.examHistory : [];
        const merged = [...localSubs, ...apiHistory];
        const unique = Array.from(new Map(merged.map(item => [item.id || item.submitted_at || item.exam_name, item])).values());
        setHistory(unique);
      })
      .catch(() => {
        setHistory(localSubs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPerformanceData();

    const handleUpdate = () => {
      loadPerformanceData();
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

  const totalExams = history.length;
  const avgScore = history.length > 0
    ? Math.round(history.reduce((a, b) => a + Number(b.percentage !== undefined ? b.percentage : (b.score || 0)), 0) / history.length)
    : 0;
  const passCount = history.filter(s => (s.status === 'Pass' || (s.percentage || 0) >= 40)).length;
  const passRate = history.length > 0 ? Math.round((passCount / history.length) * 100) : 0;

  const getSubjectBreakdown = () => {
    if (history.length === 0) {
      return { strong: [], improve: [], weak: [] };
    }
    const subjMap = {};
    history.forEach(sub => {
      const sName = sub.subject || 'General';
      const pct = Number(sub.percentage !== undefined ? sub.percentage : (sub.score || 0));
      if (!subjMap[sName]) subjMap[sName] = [];
      subjMap[sName].push(pct);
    });

    const strong = [];
    const improve = [];
    const weak = [];

    Object.entries(subjMap).forEach(([subj, pcts]) => {
      const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
      if (avg >= 70) strong.push(`${subj} (${avg}%)`);
      else if (avg >= 40) improve.push(`${subj} (${avg}%)`);
      else weak.push(`${subj} (${avg}%)`);
    });

    return { strong, improve, weak };
  };

  const { strong, improve, weak } = getSubjectBreakdown();

  const handleGetSuggestions = () => {
    const rankNum = parseInt(desiredRankInput, 10);
    if (!rankNum || rankNum <= 0) {
      setSuggestionsResult('⚠️ Please enter a valid target rank number greater than 0.');
      return;
    }

    if (rankNum <= 1000) {
      setSuggestionsResult(`🎯 Target Rank ${rankNum}: Aim for 165+/180 overall (55+ in Mathematics, 55+ in Physics, 55+ in Chemistry). Focus on speed & accuracy in Calculus and Electromagnetism.`);
    } else if (rankNum <= 5000) {
      setSuggestionsResult(`🚀 Target Rank ${rankNum}: Aim for 135+/180 overall (45+ per subject). Complete at least 5 full-length mock tests and revise high-weightage topics weekly.`);
    } else {
      setSuggestionsResult(`🛡️ Target Rank ${rankNum}: Aim for 105+/180 overall (35+ per subject). Practice previous 5 years KCET solved papers and eliminate negative errors.`);
    }
  };

  return (
    <>
      <div className="bg-mesh"></div>

      <main className="dash-main" style={{ paddingBottom: '60px' }}>
        <div className="dash-hero">
          <div>
            <h1 className="dash-title">My <span className="hero-gradient">Performance</span></h1>
            <p className="dash-sub">Detailed analytics for all your exam submissions</p>
          </div>
        </div>

        {/* 1. Summary Tiles */}
        <div className="kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="kpi-tile">
            <div className="kpi-tile-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /></svg></div>
            <div className="kpi-tile-body">
              <div className="kpi-tile-val">{totalExams}</div>
              <div className="kpi-tile-label">Total Exams</div>
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-tile-icon cyan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6" /></svg></div>
            <div className="kpi-tile-body">
              <div className="kpi-tile-val">{avgScore}%</div>
              <div className="kpi-tile-label">Avg Score</div>
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-tile-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg></div>
            <div className="kpi-tile-body">
              <div className="kpi-tile-val">{passRate}%</div>
              <div className="kpi-tile-label">Pass Rate</div>
            </div>
          </div>
        </div>

        {/* 2. AI Performance Analysis */}
        <div className="section-card" style={{ marginBottom: '20px' }}>
          <div className="section-card-header">
            <div className="section-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>
            <div>
              <h2 style={{ marginBottom: '2px' }}>AI Performance Analysis</h2>
              <p className="section-sub">Smart insights based on your exam results</p>
            </div>
          </div>
          <div className="section-body" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--rs)', padding: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--green-l)', textTransform: 'uppercase', marginBottom: '6px' }}>✅ Strong (≥ 70%)</div>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '0.82rem', color: 'var(--text)' }}>
                  {strong.length > 0 ? (
                    strong.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{history.length > 0 ? 'No subjects ≥ 70%' : 'No exam data yet'}</li>
                  )}
                </ul>
              </div>
              <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 'var(--rs)', padding: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '6px' }}>📈 Can Improve (40-69%)</div>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '0.82rem', color: 'var(--text)' }}>
                  {improve.length > 0 ? (
                    improve.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{history.length > 0 ? 'No subjects in 40-69% range' : 'Pending practice'}</li>
                  )}
                </ul>
              </div>
              <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 'var(--rs)', padding: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', marginBottom: '6px' }}>⚠️ Needs Focus (&lt; 40%)</div>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '0.82rem', color: 'var(--text)' }}>
                  {weak.length > 0 ? (
                    weak.map((item, idx) => <li key={idx}>{item}</li>)
                  ) : (
                    <li style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{history.length > 0 ? 'No subjects < 40%' : 'Take a test to see weak areas'}</li>
                  )}
                </ul>
              </div>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--muted2)', background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '12px', lineHeight: 1.6 }}>
              💡 <strong>AI Recommendation:</strong> {history.length > 0
                ? `Based on your ${totalExams} attempt${totalExams > 1 ? 's' : ''}, your average score is ${avgScore}% with a ${passRate}% pass rate. Dedicated daily revision on ${weak.length > 0 ? weak.join(', ') : 'core topics'} will maximize your KCET rank leap.`
                : 'Take your first exam to unlock AI-analyzed accuracy insights and personalized rank improvement strategies.'}
            </div>
          </div>
        </div>

        {/* 3. Rank Predictor & Suggestions */}
        <div className="section-card" style={{ marginBottom: '20px' }}>
          <div className="section-card-header">
            <div className="section-icon cyan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15l-3 3h6l-3-3z" /><path d="M5 9l7-7 7 7" /><path d="M4 19h16" /></svg></div>
            <div>
              <h2 style={{ marginBottom: '2px' }}>Rank Predictor & Action Plan</h2>
              <p className="section-sub">Personalized recommendations for target ranks</p>
            </div>
          </div>
          <div className="section-body" style={{ padding: '16px 20px' }}>
            <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>🎯 Get Suggestions for a Specific Rank</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  className="text-input"
                  placeholder="Enter desired rank e.g. 2500"
                  value={desiredRankInput}
                  onChange={(e) => setDesiredRankInput(e.target.value)}
                  min="1"
                  style={{ flex: 1, minWidth: '180px', maxWidth: '260px', padding: '8px 12px', fontSize: '0.85rem' }}
                />
                <button
                  type="button"
                  className="btn-primary small"
                  onClick={handleGetSuggestions}
                  style={{ padding: '8px 16px' }}
                >
                  Get Suggestions
                </button>
              </div>
              {suggestionsResult && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text)' }}>
                  {suggestionsResult}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. College Match Predictor */}
        <div className="section-card" style={{ marginBottom: '20px' }}>
          <div className="section-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎓</span>
              <div>
                <h2 style={{ marginBottom: '2px' }}>College Match Predictor</h2>
                <p className="section-sub">Target cutoff predictions based on current score</p>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', padding: '4px 12px', borderRadius: '20px', background: 'rgba(124,58,237,0.15)', color: 'var(--purple-l)' }}>
              Projected Rank: {history.length > 0 && avgScore > 0 ? `~${calcRankForScore(avgScore).toLocaleString()}` : '—'}
            </span>
          </div>

          <div className="section-body" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                type="button"
                className={`nav-pill ${activeTab === 'target' ? 'active' : ''}`}
                onClick={() => setActiveTab('target')}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: activeTab === 'target' ? 'var(--purple-l)' : 'transparent', color: activeTab === 'target' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
              >
                🎯 Target ({MOCK_COLLEGES.target.length})
              </button>
              <button
                type="button"
                className={`nav-pill ${activeTab === 'reach' ? 'active' : ''}`}
                onClick={() => setActiveTab('reach')}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: activeTab === 'reach' ? 'var(--purple-l)' : 'transparent', color: activeTab === 'reach' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
              >
                🚀 Reach ({MOCK_COLLEGES.reach.length})
              </button>
              <button
                type="button"
                className={`nav-pill ${activeTab === 'safe' ? 'active' : ''}`}
                onClick={() => setActiveTab('safe')}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: activeTab === 'safe' ? 'var(--purple-l)' : 'transparent', color: activeTab === 'safe' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
              >
                🛡️ Safe ({MOCK_COLLEGES.safe.length})
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {MOCK_COLLEGES[activeTab].map((col, idx) => (
                <div key={idx} style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '4px' }}>{col.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--purple-l)', fontWeight: 600 }}>{col.branch}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '8px' }}>
                    📍 {col.location} • 🎯 Cutoff Rank: ~{col.cutoffRank}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Exam History */}
        <div className="section-card results-card">
          <div className="results-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0 }}>Exam History & Detailed Submissions</h3>
          </div>
          <div className="table-scroll" style={{ overflowX: 'auto' }}>
            <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Exam Title</th>
                  <th style={{ padding: '12px 16px' }}>Subject</th>
                  <th style={{ padding: '12px 16px' }}>Score</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>KCET Weekly Mock #1</td>
                      <td style={{ padding: '12px 16px' }}>Mathematics</td>
                      <td style={{ padding: '12px 16px', color: 'var(--green-l)', fontWeight: 700 }}>52 / 60</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(5,150,105,0.15)', color: 'var(--green-l)', fontSize: '0.78rem' }}>Completed</span></td>
                      <td style={{ padding: '12px 16px' }}><Link to="/exam" className="btn-institution-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Review Solutions</Link></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>Physics Practice Test #2</td>
                      <td style={{ padding: '12px 16px' }}>Physics</td>
                      <td style={{ padding: '12px 16px', color: 'var(--green-l)', fontWeight: 700 }}>44 / 60</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(5,150,105,0.15)', color: 'var(--green-l)', fontSize: '0.78rem' }}>Completed</span></td>
                      <td style={{ padding: '12px 16px' }}><Link to="/exam" className="btn-institution-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Review Solutions</Link></td>
                    </tr>
                  </>
                ) : (
                  history.map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{h.exam_name || h.subject || 'Mock Exam'}</td>
                      <td style={{ padding: '12px 16px' }}>{h.subject || 'General'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--green-l)', fontWeight: 700 }}>{h.score} / {h.total_marks || 60}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(5,150,105,0.15)', color: 'var(--green-l)', fontSize: '0.78rem' }}>Completed</span></td>
                      <td style={{ padding: '12px 16px' }}><Link to="/exam" className="btn-institution-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>Review</Link></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default StudentInstitutionPerformance;
