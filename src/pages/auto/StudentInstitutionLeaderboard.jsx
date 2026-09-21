import React, { useState, useEffect } from 'react';
import { generateStudentId } from '../../utils/studentId';

const SEED_LEADERBOARD = [
  { rank: 1, name: 'Ananya Rao', student_id: 'SMVITM-89A41', avg_score: '96.5%', exams_taken: 14, badge: '🥇 1st Place' },
  { rank: 2, name: 'Rohan Sharma', student_id: 'SMVITM-74B12', avg_score: '94.2%', exams_taken: 12, badge: '🥈 2nd Place' },
  { rank: 3, name: 'Priya Kulkarni', student_id: 'SMVITM-65C49', avg_score: '92.8%', exams_taken: 15, badge: '🥉 3rd Place' },
  { rank: 4, name: 'Aditya Hegde', student_id: 'SMVITM-51D90', avg_score: '89.4%', exams_taken: 10, badge: 'Top 5%' },
  { rank: 5, name: 'Varun Shetty', student_id: 'SMVITM-38E22', avg_score: '87.1%', exams_taken: 11, badge: 'Top 5%' },
  { rank: 6, name: 'Kavya Bhat', student_id: 'SMVITM-29F65', avg_score: '85.6%', exams_taken: 9, badge: 'Top 10%' },
  { rank: 7, name: 'Siddharth Patil', student_id: 'SMVITM-18G33', avg_score: '83.0%', exams_taken: 8, badge: 'Top 10%' },
];

const StudentInstitutionLeaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [myName, setMyName] = useState('Student');
  const [myId, setMyId] = useState('STD-001');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(p => {
        if (p.authenticated) {
          const name = p.name || p.full_name || p.username || (p.email ? p.email.split('@')[0] : '');
          if (name) setMyName(name);

          if (p.kcet_student_id) setMyId(p.kcet_student_id);
          else setMyId(generateStudentId(p));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = SEED_LEADERBOARD.filter(item => 
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
            <p className="dash-sub">Top performers in your institution cohort</p>
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
                  filtered.map((s) => (
                    <tr key={s.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: s.rank <= 3 ? 'rgba(124,58,237,0.06)' : 'transparent' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 800, fontSize: '1rem', color: s.rank === 1 ? '#eab308' : s.rank === 2 ? '#94a3b8' : s.rank === 3 ? '#d97706' : 'var(--text)' }}>
                        #{s.rank}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--purple-l)' }}>{s.student_id}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--green-l)', fontWeight: 700 }}>{s.avg_score}</td>
                      <td style={{ padding: '12px 16px' }}>{s.exams_taken} Exams</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', background: 'rgba(124,58,237,0.15)', color: 'var(--purple-l)', fontWeight: 700 }}>
                          {s.badge}
                        </span>
                      </td>
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

export default StudentInstitutionLeaderboard;
