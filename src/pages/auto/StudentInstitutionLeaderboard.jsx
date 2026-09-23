import React, { useState, useEffect, useCallback } from 'react';
import { generateStudentId } from '../../utils/studentId';

const SEED_LEADERBOARD = [
  { name: 'Ananya Rao', student_id: 'SMVITM-89A41', avgScoreNum: 96.5, exams_taken: 14 },
  { name: 'Rohan Sharma', student_id: 'SMVITM-74B12', avgScoreNum: 94.2, exams_taken: 12 },
  { name: 'Priya Kulkarni', student_id: 'SMVITM-65C49', avgScoreNum: 92.8, exams_taken: 15 },
  { name: 'Aditya Hegde', student_id: 'SMVITM-51D90', avgScoreNum: 89.4, exams_taken: 10 },
  { name: 'Varun Shetty', student_id: 'SMVITM-38E22', avgScoreNum: 87.1, exams_taken: 11 },
  { name: 'Kavya Bhat', student_id: 'SMVITM-29F65', avgScoreNum: 85.6, exams_taken: 9 },
  { name: 'Siddharth Patil', student_id: 'SMVITM-18G33', avgScoreNum: 83.0, exams_taken: 8 },
];

const StudentInstitutionLeaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [myName, setMyName] = useState('Student');
  const [myId, setMyId] = useState('STD-001');
  const [leaderboard, setLeaderboard] = useState([]);

  const loadLeaderboard = useCallback(async () => {
    let currentStudentName = myName;
    let currentStudentId = myId;

    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (meRes.ok) {
        const p = await meRes.json();
        if (p.authenticated) {
          const name = p.name || p.full_name || p.username || (p.email ? p.email.split('@')[0] : '');
          if (name) {
            setMyName(name);
            currentStudentName = name;
          }
          const stdId = p.kcet_student_id || generateStudentId(p);
          setMyId(stdId);
          currentStudentId = stdId;
        }
      }
    } catch (e) {}

    // Read local submissions
    const allSubs = JSON.parse(localStorage.getItem('vyasaprep_submissions') || '[]');

    // Group submissions by student
    const studentMap = new Map();

    // Populate seed entries first
    SEED_LEADERBOARD.forEach(item => {
      studentMap.set(item.student_id.toLowerCase(), {
        name: item.name,
        student_id: item.student_id,
        scores: [item.avgScoreNum],
        exams_taken: item.exams_taken
      });
    });

    // Merge actual student submissions
    allSubs.forEach(sub => {
      if (!sub) return;
      const sId = String(sub.student_id || sub.user_id || sub.sub || currentStudentId || 'STD-001').trim();
      const sName = sub.student_name || currentStudentName || 'Student';
      const pct = Number(sub.percentage !== undefined ? sub.percentage : (sub.score || 0));

      const key = sId.toLowerCase();
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          name: sName,
          student_id: sId,
          scores: [pct],
          exams_taken: 1
        });
      } else {
        const existing = studentMap.get(key);
        existing.scores.push(pct);
        existing.exams_taken = (existing.exams_taken || 0) + 1;
        if (sName && sName !== 'Student') existing.name = sName;
      }
    });

    // Format & sort leaderboard entries
    const rawList = Array.from(studentMap.values()).map(item => {
      const avg = item.scores.length > 0
        ? Math.round((item.scores.reduce((a, b) => a + b, 0) / item.scores.length) * 10) / 10
        : 0;
      return {
        name: item.name,
        student_id: item.student_id,
        avg_score: `${avg}%`,
        avgScoreNum: avg,
        exams_taken: item.exams_taken
      };
    });

    rawList.sort((a, b) => b.avgScoreNum - a.avgScoreNum || b.exams_taken - a.exams_taken);

    // Assign ranks & badges
    const rankedList = rawList.map((item, idx) => {
      const rank = idx + 1;
      let badge = 'Top 10%';
      if (rank === 1) badge = '🥇 1st Place';
      else if (rank === 2) badge = '🥈 2nd Place';
      else if (rank === 3) badge = '🥉 3rd Place';
      else if (rank <= 5) badge = 'Top 5%';

      return {
        ...item,
        rank,
        badge
      };
    });

    setLeaderboard(rankedList);
  }, [myId, myName]);

  useEffect(() => {
    loadLeaderboard();

    const handleUpdate = () => {
      loadLeaderboard();
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
  }, [loadLeaderboard]);

  const filtered = leaderboard.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-mesh"></div>

      <main className="dash-main" style={{ paddingBottom: '60px' }}>
        <div className="dash-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 className="dash-title">Institution <span className="hero-gradient">Leaderboard</span></h1>
            <p className="dash-sub">Live real-time rankings in your institution cohort</p>
          </div>
          <div style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600 }}>
            Student: <strong style={{ color: 'var(--text)' }}>{myName}</strong> (<span style={{ color: 'var(--purple-l)', fontFamily: 'monospace' }}>{myId}</span>)
          </div>
        </div>

        <div className="section-card results-card">
          <div className="results-header" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0 }}>🏆 Institution Rankings</h3>
            <div className="results-search" style={{ margin: 0, maxWidth: '280px' }}>
              <input
                type="text"
                className="text-input"
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className="table-scroll" style={{ overflowX: 'auto' }}>
            <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', width: '70px' }}>Rank</th>
                  <th style={{ padding: '12px 16px' }}>Student Name</th>
                  <th style={{ padding: '12px 16px' }}>Student ID</th>
                  <th style={{ padding: '12px 16px' }}>Avg Score</th>
                  <th style={{ padding: '12px 16px' }}>Exams Taken</th>
                  <th style={{ padding: '12px 16px' }}>Badge</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                      No students match your search term.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const isMe = String(s.student_id).toLowerCase() === String(myId).toLowerCase();
                    return (
                      <tr key={s.student_id || s.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isMe ? 'rgba(16, 185, 129, 0.12)' : (s.rank <= 3 ? 'rgba(124,58,237,0.06)' : 'transparent') }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, fontSize: '1rem', color: s.rank === 1 ? '#eab308' : s.rank === 2 ? '#94a3b8' : s.rank === 3 ? '#d97706' : 'var(--text)' }}>
                          #{s.rank}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          {s.name} {isMe && <span style={{ fontSize: '0.75rem', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px' }}>YOU</span>}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--purple-l)' }}>{s.student_id}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--green-l)', fontWeight: 700 }}>{s.avg_score}</td>
                        <td style={{ padding: '12px 16px' }}>{s.exams_taken} {s.exams_taken === 1 ? 'Exam' : 'Exams'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(124,58,237,0.15)', color: 'var(--purple-l)', fontWeight: 700 }}>
                            {s.badge}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};

export default StudentInstitutionLeaderboard;
