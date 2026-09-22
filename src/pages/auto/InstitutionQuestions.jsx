import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const InstitutionQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [counts, setCounts] = useState({});
  const [filterSubject, setFilterSubject] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [instProfile, setInstProfile] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const p = await res.json();
        if (p && p.authenticated) setInstProfile(p);
      }
    } catch (e) {}
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      let profileData = instProfile;
      if (!profileData) {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (meRes.ok) {
          profileData = await meRes.json().catch(() => null);
          if (profileData && profileData.authenticated) setInstProfile(profileData);
        }
      }

      const currentInstId = String(profileData?.institution_id || profileData?.join_code || profileData?.id || '').toLowerCase().trim();
      const currentInstName = String(profileData?.institution_name || profileData?.name || profileData?.username || '').toLowerCase().trim();

      // Fetch questions to compute institution-specific private question counts
      let res = await fetch('/api/institution/content/questions?page_size=1000', { credentials: 'include' });
      if (!res.ok) {
        res = await fetch('/api/institution/questions?page_size=1000', { credentials: 'include' });
      }

      if (res.ok) {
        const data = await res.json();
        let fetchedList = [];
        if (Array.isArray(data)) {
          fetchedList = data;
        } else if (data && typeof data === 'object') {
          fetchedList = data.questions || data.items || data.mcqs || data.results || data.data || [];
        }

        // STRICT INSTITUTION ISOLATION FOR COUNTS:
        const instQuestions = fetchedList.filter(q => {
          if (!q) return false;
          const qInstId = String(q.institution_id || q.created_by_institution_id || q.inst_id || '').toLowerCase().trim();
          const qInstName = String(q.institution_name || q.created_by_institution_name || q.inst_name || '').toLowerCase().trim();

          const matchId = currentInstId && qInstId && (currentInstId === qInstId || currentInstId.includes(qInstId) || qInstId.includes(currentInstId));
          const matchName = currentInstName && qInstName && (currentInstName === qInstName || currentInstName.includes(qInstName) || qInstName.includes(currentInstName));

          if (qInstId || qInstName) {
            return Boolean(matchId || matchName);
          }

          if (q.created_by_type === 'institution' || q.created_by_institution === true) {
            return Boolean(matchId || matchName);
          }

          return false; // Exclude non-institution system questions from institution count
        });

        const subjectCounts = { Biology: 0, Physics: 0, Chemistry: 0, Mathematics: 0 };
        instQuestions.forEach(q => {
          const s = String(q.subject || q.subject_name || q.category || '').trim();
          const foundKey = Object.keys(subjectCounts).find(k => k.toLowerCase() === s.toLowerCase());
          if (foundKey) {
            subjectCounts[foundKey]++;
          }
        });

        setCounts(subjectCounts);
      }
    } catch (err) {
      console.error('Failed to fetch institution question counts:', err);
    }
  }, [instProfile]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let profileData = instProfile;
      if (!profileData) {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (meRes.ok) {
          profileData = await meRes.json().catch(() => null);
          if (profileData && profileData.authenticated) setInstProfile(profileData);
        }
      }

      const currentInstId = String(profileData?.institution_id || profileData?.join_code || profileData?.id || '').toLowerCase().trim();
      const currentInstName = String(profileData?.institution_name || profileData?.name || profileData?.username || '').toLowerCase().trim();

      const params = new URLSearchParams({
        page: String(currentPage),
        page_size: String(pageSize),
      });
      if (filterSubject) params.append('subject', filterSubject);

      let res = await fetch(`/api/institution/content/questions?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) {
        res = await fetch(`/api/institution/questions?${params.toString()}`, { credentials: 'include' });
      }
      
      if (res.ok) {
        const data = await res.json();
        let fetchedList = [];
        
        if (Array.isArray(data)) {
          fetchedList = data;
        } else if (data && typeof data === 'object') {
          fetchedList = data.questions || data.items || data.mcqs || data.results || data.data || [];
        }

        // STRICT INSTITUTION QUESTION ISOLATION:
        const filteredList = fetchedList.filter(q => {
          if (!q) return false;
          const qInstId = String(q.institution_id || q.created_by_institution_id || q.inst_id || '').toLowerCase().trim();
          const qInstName = String(q.institution_name || q.created_by_institution_name || q.inst_name || '').toLowerCase().trim();

          const matchId = currentInstId && qInstId && (currentInstId === qInstId || currentInstId.includes(qInstId) || qInstId.includes(currentInstId));
          const matchName = currentInstName && qInstName && (currentInstName === qInstName || currentInstName.includes(qInstName) || qInstName.includes(currentInstName));

          if (qInstId || qInstName) {
            return Boolean(matchId || matchName);
          }

          if (q.created_by_type === 'institution' || q.created_by_institution === true) {
            return Boolean(matchId || matchName);
          }

          return false;
        });

        setQuestions(filteredList);

        const totalInstCount = Object.values(counts).reduce((a, b) => a + Number(b || 0), 0);
        setTotalQuestions(filterSubject ? (counts[filterSubject] || filteredList.length) : (totalInstCount || filteredList.length));
      } else {
        setQuestions([]);
        setTotalQuestions(0);
      }
    } catch (err) {
      console.error('Failed to fetch institution question bank:', err);
      setError('Unable to load questions from database. Ensure the backend server is active.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterSubject, instProfile, counts]);

  useEffect(() => {
    fetchProfile();
    fetchCounts();
  }, [fetchProfile, fetchCounts]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      let res = await fetch(`/api/institution/content/questions/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        res = await fetch(`/api/institution/questions/${deleteId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      if (res.ok) {
        setDeleteId(null);
        fetchQuestions();
        fetchCounts();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to delete question.');
      }
    } catch (err) {
      alert('Error deleting question.');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(totalQuestions / pageSize) || 1;
  const subjects = ['Biology', 'Physics', 'Chemistry', 'Mathematics'];
  const totalStored = Object.values(counts).reduce((a, b) => a + Number(b || 0), 0);

  return (
    <>
      <div className="bg-mesh"></div>

      <main className="main-wrap" style={{ padding: '24px' }}>
        {/* Header section card */}
        <div className="section-card" style={{ marginBottom: '20px' }}>
          <div className="section-card-header" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div className="section-icon" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.2))' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h2 style={{ margin: 0 }}>Institution Question Bank</h2>
              <p className="section-sub" style={{ margin: '2px 0 0' }}>
                View and manage all extracted MCQs fetched/stored in your institution's private question bank
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Link to="/institution/upload" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload &amp; Extract More
              </Link>
            </div>
          </div>

          {/* Counts overview tiles */}
          <div className="section-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-l)' }}>{totalStored || totalQuestions}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>Total Questions</div>
              </div>
              {subjects.map((subj) => (
                <div
                  key={subj}
                  onClick={() => {
                    setFilterSubject(filterSubject === subj ? '' : subj);
                    setCurrentPage(1);
                  }}
                  style={{
                    background: filterSubject === subj ? 'rgba(124, 58, 237, 0.12)' : 'var(--s2)',
                    border: filterSubject === subj ? '1px solid var(--purple-l)' : '1px solid var(--border)',
                    borderRadius: 'var(--rs)',
                    padding: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>{counts[subj] || 0}</div>
                  <div style={{ fontSize: '0.78rem', color: filterSubject === subj ? 'var(--purple-l)' : 'var(--muted)', fontWeight: 600, marginTop: '2px' }}>
                    {subj}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Questions list table card */}
        <div className="section-card">
          <div className="section-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ margin: 0 }}>{filterSubject ? `${filterSubject} Questions` : 'All Fetched Questions'} ({totalQuestions})</h2>
              <p className="section-sub" style={{ margin: '2px 0 0' }}>
                Showing page {currentPage} of {totalPages}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <select
                className="text-input"
                value={filterSubject}
                onChange={(e) => {
                  setFilterSubject(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ minWidth: '160px', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value="">All Subjects</option>
                <option value="Biology">Biology</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
              </select>

              <button
                type="button"
                className="btn-outline small"
                onClick={fetchQuestions}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '13px', height: '13px' }}>
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="section-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px', color: 'var(--muted)' }}>⏳ Loading fetched questions...</div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--red-l)' }}>{error}</div>
            ) : questions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>
                  {filterSubject ? `No ${filterSubject} Questions Fetched` : 'No Questions in Institution Bank'}
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', maxWidth: '480px', marginInline: 'auto' }}>
                  Upload question papers or textbooks to automatically extract and populate MCQs in your institution question bank.
                </p>
                <Link to="/institution/upload" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Upload &amp; Extract MCQs →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {questions.map((q, idx) => {
                  const qIndex = (currentPage - 1) * pageSize + idx + 1;
                  const qId = q.id || q.question_id || q._id || idx;
                  const isExpanded = expandedId === qId;

                  const questionText = q.question || q.question_text || q.stem || q.text || q.title || 'Question text unavailable';
                  const subjectName = q.subject || q.subject_name || q.category || 'General';
                  const topicName = q.topic || q.chapter || q.subtopic || '';

                  // Extract options array/object safely
                  const rawOpts = q.options || q.choices || q.answers || [];
                  let optionsList = [];
                  if (Array.isArray(rawOpts)) {
                    optionsList = rawOpts.map((opt, i) => ({
                      label: String.fromCharCode(65 + i),
                      text: typeof opt === 'object' ? opt.text || opt.option || opt.choice || JSON.stringify(opt) : String(opt),
                    }));
                  } else if (rawOpts && typeof rawOpts === 'object') {
                    optionsList = Object.entries(rawOpts).map(([key, val]) => ({
                      label: key.toUpperCase(),
                      text: String(val),
                    }));
                  }

                  const correctStr = String(q.correct_option ?? q.answer ?? q.correct_answer ?? q.correct ?? '').toUpperCase();

                  return (
                    <div
                      key={qId}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--border)',
                        background: isExpanded ? 'rgba(124, 58, 237, 0.03)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--purple-l)', fontSize: '0.9rem' }}>#{qIndex}</span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                background:
                                  subjectName === 'Biology'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : subjectName === 'Physics'
                                    ? 'rgba(59, 130, 246, 0.15)'
                                    : subjectName === 'Chemistry'
                                    ? 'rgba(245, 158, 11, 0.15)'
                                    : 'rgba(124, 58, 237, 0.15)',
                                color:
                                  subjectName === 'Biology'
                                    ? '#10b981'
                                    : subjectName === 'Physics'
                                    ? '#3b82f6'
                                    : subjectName === 'Chemistry'
                                    ? '#f59e0b'
                                    : '#a78bfa',
                                fontWeight: 600,
                              }}
                            >
                              {subjectName}
                            </span>
                            {topicName && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', background: 'var(--s2)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '10px' }}>
                                {topicName}
                              </span>
                            )}
                          </div>

                          <p style={{ margin: 0, fontSize: '0.96rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>
                            {questionText}
                          </p>

                          {/* Options display */}
                          {optionsList.length > 0 && (
                            <div style={{ marginTop: '12px', display: isExpanded ? 'grid' : 'none', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                              {optionsList.map((opt, oIdx) => {
                                const isCorrect =
                                  correctStr === opt.label ||
                                  correctStr === String(oIdx) ||
                                  correctStr === opt.text.toUpperCase();
                                return (
                                  <div
                                    key={oIdx}
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: 'var(--rs)',
                                      border: isCorrect ? '1px solid #10b981' : '1px solid var(--border)',
                                      background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--s2)',
                                      fontSize: '0.85rem',
                                      color: isCorrect ? '#10b981' : 'var(--text)',
                                      fontWeight: isCorrect ? 600 : 400,
                                    }}
                                  >
                                    <span style={{ fontWeight: 700, marginRight: '6px' }}>{opt.label}.</span>
                                    {opt.text} {isCorrect && ' ✓'}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn-outline small"
                            onClick={() => setExpandedId(isExpanded ? null : qId)}
                            style={{ fontSize: '0.78rem' }}
                          >
                            {isExpanded ? 'Hide Options' : 'View Options'}
                          </button>
                          <button
                            type="button"
                            className="btn-outline small"
                            onClick={() => setDeleteId(qId)}
                            style={{ fontSize: '0.78rem', color: 'var(--red-l)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination footer */}
            {totalQuestions > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, totalQuestions)}–{Math.min(currentPage * pageSize, totalQuestions)} of {totalQuestions} questions
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-outline small"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    className="btn-outline small"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '28px', maxWidth: '420px', width: '90%' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>Delete Question?</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: '0 0 20px' }}>
              This will permanently remove the question from your question bank. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn-outline small" onClick={() => setDeleteId(null)} disabled={deleting}>
                Cancel
              </button>
              <button type="button" className="btn-primary small" onClick={handleDelete} disabled={deleting} style={{ background: 'var(--red)', borderColor: 'var(--red)' }}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstitutionQuestions;
