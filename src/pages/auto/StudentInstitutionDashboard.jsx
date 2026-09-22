import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredExams, mergeExamsWithLocal, subscribeToExamChanges } from '../../utils/examStore';
import { generateStudentId, extractStudentName } from '../../utils/studentId';

const MOCK_COLLEGES = {
  target: [
    { name: 'BMS College of Engineering (BMSCE), Bengaluru', branch: 'Computer Science & Engineering', cutoffRank: 1250, location: 'Bengaluru' },
    { name: 'MS Ramaiah Institute of Technology (MSRIT)', branch: 'Information Science & Engineering', cutoffRank: 1840, location: 'Bengaluru' },
  ],
  reach: [
    { name: 'RV College of Engineering (RVCE)', branch: 'Computer Science & Engineering', cutoffRank: 420, location: 'Bengaluru' },
    { name: 'PES University (Ring Road Campus)', branch: 'Artificial Intelligence & Machine Learning', cutoffRank: 780, location: 'Bengaluru' },
  ],
  safe: [
    { name: 'Dayananda Sagar College of Engineering (DSCE)', branch: 'Computer Science & Engineering', cutoffRank: 3200, location: 'Bengaluru' },
    { name: 'Bangalore Institute of Technology (BIT)', branch: 'Electronics & Communication', cutoffRank: 4500, location: 'Bengaluru' },
  ]
};

const StudentInstitutionDashboard = () => {
  const [activeExams, setActiveExams] = useState(() => getStoredExams().filter(e => e.is_published !== false));
  const [studentName, setStudentName] = useState(() => extractStudentName(null));
  const [studentId, setStudentId] = useState('—');
  const [institutionName, setInstitutionName] = useState('Institution');
  const [examsTaken, setExamsTaken] = useState(0);
  const [avgScore, setAvgScore] = useState('0.0%');
  const [cohortRank, setCohortRank] = useState('—');
  const [activeTab, setActiveTab] = useState('target');
  const [searchQuery, setSearchQuery] = useState('');
  const [desiredRank, setDesiredRank] = useState('');
  const [rankSuggestion, setRankSuggestion] = useState('');
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = () => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(profile => {
        if (profile.authenticated) {
          const name = extractStudentName(profile);
          if (name && name !== 'Student') setStudentName(name);

          if (profile.kcet_student_id) setStudentId(profile.kcet_student_id);
          else if (profile.sub && !profile.sub.includes('@')) setStudentId(profile.sub);
          else setStudentId(generateStudentId(profile));

          if (profile.institution_name) setInstitutionName(profile.institution_name);
        }
      })
      .catch(() => {});

    fetch('/api/student/dashboard-stats', { credentials: 'include' })
      .then(res => res.json())
      .then(stats => {
        if (stats && !stats.error) {
          const name = extractStudentName(stats.student) || extractStudentName(stats);
          if (name && name !== 'Student') setStudentName(name);

          if (stats.student?.kcet_student_id) setStudentId(stats.student.kcet_student_id);
          else if (stats.kpis?.studentId) setStudentId(stats.kpis.studentId);

          if (stats.student?.institution_name) setInstitutionName(stats.student.institution_name);

          const taken = stats.kpis?.examsTaken ?? stats.kpis?.submissions ?? 0;
          setExamsTaken(taken);

          const avg = stats.kpis?.avgScore !== undefined ? stats.kpis.avgScore : 0;
          setAvgScore(`${avg}%`);

          const rankStr = stats.kpis?.cohortRank || stats.student?.cohort_rank || '—';
          setCohortRank(rankStr);
        }
      })
      .catch(() => {});

    // Fetch authoritative exams created by admin
    fetch('/api/student/exams', { credentials: 'include' })
      .then(res => res.json())
      .then(d => {
        let list = [];
        if (d && Array.isArray(d.subjects)) {
          d.subjects.forEach(sg => {
            (sg.exams || []).forEach(ex => {
              list.push({ ...ex, subject: ex.subject || sg.subject });
            });
          });
        } else if (d && Array.isArray(d.exams)) {
          list = d.exams;
        }
        if (list.length > 0) {
          const merged = mergeExamsWithLocal(list);
          setActiveExams(merged.filter(e => e.is_published !== false));
        } else {
          setActiveExams(getStoredExams().filter(e => e.is_published !== false));
        }
      })
      .catch(() => {
        setActiveExams(getStoredExams().filter(e => e.is_published !== false));
      });
  };

  useEffect(() => {
    loadDashboardData();
    const unsubscribe = subscribeToExamChanges((updatedList) => {
      setActiveExams(updatedList.filter(e => e.is_published !== false));
    });

    const handleUpdate = () => {
      loadDashboardData();
      setActiveExams(getStoredExams().filter(e => e.is_published !== false));
      setLastUpdated(new Date().toLocaleTimeString());
    };

    window.addEventListener('exam-submitted', handleUpdate);
    window.addEventListener('exam-completed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('exam-submitted', handleUpdate);
      window.removeEventListener('exam-completed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    setTimeout(() => {
      setActiveExams(getStoredExams().filter(e => e.is_published !== false));
      setLastUpdated(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 400);
  };

  const handleGetSuggestions = () => {
    const num = parseInt(desiredRank, 10);
    if (!num || num <= 0) {
      setRankSuggestion('⚠️ Please enter a target KCET rank e.g. 3000.');
      return;
    }

    if (num <= 1000) {
      setRankSuggestion(`🎯 Target Rank ${num}: Aim for 165+/180 overall. Maintain 95%+ accuracy in Mathematics & Physics.`);
    } else if (num <= 5000) {
      setRankSuggestion(`🚀 Target Rank ${num}: Aim for 135+/180 overall. Solve past weekly tests and focus on weak topics.`);
    } else {
      setRankSuggestion(`🛡️ Target Rank ${num}: Aim for 105+/180 overall. Practice speed management on 60-minute mock sets.`);
    }
  };

  const filteredColleges = MOCK_COLLEGES[activeTab].filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-mesh"></div>

      {/* Top Banner */}
      <div className="inst-access-bar" style={{ background: 'linear-gradient(90deg, rgba(37,99,235,0.14), rgba(124,58,237,0.14))', borderBottom: '1px solid rgba(124,58,237,0.22)', padding: '10px 28px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <span className="inst-label-badge" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '3px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--purple-l)', textTransform: 'uppercase' }}>
          🏫 Institution Student
        </span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
          {institutionName} • <span style={{ color: 'var(--purple-l)' }}>{studentName}</span> ({studentId})
        </span>
        <span style={{ marginLeft: 'auto', background: 'rgba(5,150,105,0.14)', border: '1px solid rgba(5,150,105,0.3)', color: 'var(--green-l)', borderRadius: '20px', padding: '3px 12px', fontSize: '0.72rem', fontWeight: 700 }}>
          ● Active Access
        </span>
      </div>

      <main className="dash-main" style={{ paddingBottom: '60px' }}>
        {/* Header */}
        <div className="dash-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 className="dash-title">Institution <span className="hero-gradient">Dashboard</span></h1>
            <p className="dash-sub">
              Welcome back, <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>{studentName}</strong>! • Student ID: <strong style={{ color: 'var(--purple-l)' }}>{studentId}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>Last updated: {lastUpdated}</span>
            <button
              type="button"
              className="btn-outline"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>STUDENT NAME</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{studentName}</div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>STUDENT ID</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--purple-l)', fontFamily: 'monospace', marginTop: '4px' }}>{studentId}</div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>EXAMS TAKEN</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{examsTaken} Completed</div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>AVERAGE SCORE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--green-l)', marginTop: '4px' }}>{avgScore}</div>
          </div>
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 700 }}>COHORT RANK</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>{cohortRank}</div>
          </div>
        </div>

        {/* Section Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {/* 1. Available Exams */}
          <div className="section-card">
            <div className="section-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', margin: 0 }}>📚 Available Weekly Exams</h2>
                <p className="section-sub" style={{ margin: '2px 0 0 0' }}>Published by your institution</p>
              </div>
              <Link to="/student/institution/exams" style={{ fontSize: '0.82rem', color: 'var(--purple-l)', textDecoration: 'none', fontWeight: 600 }}>
                View all ({activeExams.length}) →
              </Link>
            </div>
            <div className="section-body" style={{ padding: '16px 20px' }}>
              {activeExams.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>No published exams available yet.</div>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {activeExams.slice(0, 4).map((exam, i) => {
                    const name = exam.exam_name || exam.name || 'Weekly Test';
                    const firstSetId = exam.sets && exam.sets.length > 0 ? exam.sets[0].exam_set_id : (exam.exam_id || exam.id || '');
                    return (
                      <li key={exam.exam_id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{exam.subject || 'Mathematics'} • {exam.duration_minutes || 60} Mins</div>
                        </div>
                        <Link
                          to={`/exam?set=${firstSetId}&subject=${encodeURIComponent(exam.subject || 'Mathematics')}&name=${encodeURIComponent(name)}`}
                          className="btn-primary small"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
                        >
                          Take Test →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* 2. Quick Actions */}
          <div className="section-card">
            <div className="section-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.05rem', margin: 0 }}>⚡ Quick Actions</h2>
              <p className="section-sub" style={{ margin: '2px 0 0 0' }}>Jump directly to key tools</p>
            </div>
            <div className="section-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/student/institution/exams" className="qa-btn primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--purple), var(--blue))', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
                📝 View All Assigned Exams
              </Link>
              <Link to="/student/institution/performance" className="qa-btn outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
                📈 Full Performance Analytics
              </Link>
              <Link to="/student/institution/leaderboard" className="qa-btn outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
                🏆 Institution Cohort Rankings
              </Link>
              <Link to="/syllabus" className="qa-btn outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
                📖 KCET Official Syllabus & Topics
              </Link>
            </div>
          </div>
        </div>

        {/* AI Rank Suggestions */}
        <div className="section-card" style={{ marginBottom: '24px' }}>
          <div className="section-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.05rem', margin: 0 }}>🎯 Target Rank Suggestions</h2>
            <p className="section-sub" style={{ margin: '2px 0 0 0' }}>Enter your dream KCET rank to receive an action plan</p>
          </div>
          <div className="section-body" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: rankSuggestion ? '14px' : '0' }}>
              <input
                type="number"
                className="text-input"
                placeholder="Enter desired rank e.g. 2500"
                value={desiredRank}
                onChange={(e) => setDesiredRank(e.target.value)}
                min="1"
                style={{ flex: 1, minWidth: '200px', maxWidth: '300px', padding: '8px 12px' }}
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
            {rankSuggestion && (
              <div style={{ padding: '12px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text)' }}>
                {rankSuggestion}
              </div>
            )}
          </div>
        </div>

        {/* College Match Predictor */}
        <div className="section-card">
          <div className="section-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', margin: 0 }}>🎓 College Match Predictor</h2>
              <p className="section-sub" style={{ margin: '2px 0 0 0' }}>Explore matched engineering colleges</p>
            </div>
            <div className="results-search" style={{ margin: 0, maxWidth: '240px' }}>
              <input
                type="text"
                className="text-input"
                placeholder="Filter colleges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className="section-body" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('target')}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: activeTab === 'target' ? 'var(--purple-l)' : 'transparent', color: activeTab === 'target' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
              >
                🎯 Target ({MOCK_COLLEGES.target.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reach')}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: activeTab === 'reach' ? 'var(--purple-l)' : 'transparent', color: activeTab === 'reach' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
              >
                🚀 Reach ({MOCK_COLLEGES.reach.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('safe')}
                style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border)', background: activeTab === 'safe' ? 'var(--purple-l)' : 'transparent', color: activeTab === 'safe' ? '#fff' : 'var(--text)', cursor: 'pointer' }}
              >
                🛡️ Safe ({MOCK_COLLEGES.safe.length})
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {filteredColleges.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No colleges match your filter.</div>
              ) : (
                filteredColleges.map((col, idx) => (
                  <div key={idx} style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '4px' }}>{col.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--purple-l)', fontWeight: 600 }}>{col.branch}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '8px' }}>
                      📍 {col.location} • 🎯 Cutoff Rank: ~{col.cutoffRank}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default StudentInstitutionDashboard;
