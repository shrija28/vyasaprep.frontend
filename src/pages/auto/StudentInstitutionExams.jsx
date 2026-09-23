import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateStudentId, getAssignedSetForStudent } from '../../utils/studentId';
import { getStoredExams, mergeExamsWithLocal, normalizeExamSubjects, subscribeToExamChanges } from '../../utils/examStore';

const StudentInstitutionExams = () => {
  const [subjects, setSubjects] = useState(() => normalizeExamSubjects(getStoredExams()));
  const [studentName, setStudentName] = useState('Student');
  const [studentId, setStudentId] = useState('STD-001');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfileAndExams = async () => {
    setLoading(true);
    setError('');
    try {
      let profile = null;
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (meRes.ok) {
        profile = await meRes.json();
        if (profile.authenticated) {
          const name = profile.name || profile.full_name || profile.username || (profile.email ? profile.email.split('@')[0] : '');
          if (name) setStudentName(name);

          const stdId = profile.kcet_student_id || generateStudentId(profile);
          setStudentId(stdId);
          localStorage.setItem('vyasaprep_active_student_id', stdId);
        }
      }

      // Fetch from student / institution endpoints
      let res = await fetch('/api/student/exams', { credentials: 'include' });
      let data = null;

      if (res.ok) {
        data = await res.json().catch(() => null);
      }

      if (!data) {
        res = await fetch('/api/student/institution/exams', { credentials: 'include' });
        if (res.ok) {
          data = await res.json().catch(() => null);
        }
      }

      if (!data) {
        res = await fetch('/api/institution/content/exams', { credentials: 'include' });
        if (res.ok) {
          data = await res.json().catch(() => null);
        }
      }

      const fetchedList = [];
      if (data) {
        if (Array.isArray(data.subjects)) {
          data.subjects.forEach(sg => {
            (sg.exams || []).forEach(ex => {
              fetchedList.push({
                ...ex,
                subject: ex.subject || sg.subject,
              });
            });
          });
        } else if (Array.isArray(data.exams)) {
          fetchedList.push(...data.exams);
        } else if (Array.isArray(data.data)) {
          fetchedList.push(...data.data);
        } else if (Array.isArray(data)) {
          fetchedList.push(...data);
        }
      }
      const mergedList = mergeExamsWithLocal(fetchedList);

      const studentInstName = String(profile?.institution_name || profile?.institution_code || profile?.join_code || '').toLowerCase().trim();
      const studentInstId = String(profile?.institution_id || profile?.join_code || '').toLowerCase().trim();

      const filteredList = mergedList.filter(ex => {
        if (!ex) return false;
        if (ex.is_published === false) return false;

        const exInstId = String(ex.institution_id || ex.created_by_institution_id || '').toLowerCase().trim();
        const exInstName = String(ex.institution_name || ex.created_by_institution_name || '').toLowerCase().trim();

        // System/admin seed exams MUST NOT appear on institution platform
        if (ex.created_by_type === 'system' || ex.created_by_type === 'admin' || exInstId === 'system' || exInstId === 'admin') {
          return false;
        }

        // If student profile specifies a particular institution ID/name, match against it
        if (studentInstId || studentInstName) {
          const matchId = studentInstId && exInstId && (studentInstId === exInstId || studentInstId.includes(exInstId) || exInstId.includes(studentInstId));
          const matchName = studentInstName && exInstName && (studentInstName === exInstName || studentInstName.includes(exInstName) || exInstName.includes(studentInstName));
          if (exInstId || exInstName) {
            return Boolean(matchId || matchName);
          }
        }

        // If student profile has no institution filter or exam was created on institution platform, include it
        return true;
      });

      const parsedSubjects = normalizeExamSubjects(filteredList);
      setSubjects(parsedSubjects);
    } catch (err) {
      console.error('Error fetching institution exams:', err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndExams();

    const unsubscribe = subscribeToExamChanges(() => {
      fetchProfileAndExams();
    });

    const handleUpdate = () => {
      fetchProfileAndExams();
    };

    window.addEventListener('exam-submitted', handleUpdate);
    window.addEventListener('exam-completed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('exam-submitted', handleUpdate);
      window.removeEventListener('exam-completed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <>
      <div className="bg-mesh"></div>

      <main className="dash-main">
        <div className="dash-hero">
          <div>
            <h1 className="dash-title">
              Institution <span className="hero-gradient">Exams</span>
            </h1>
            <p className="dash-sub">
              Published exams for your institution — paper sets assigned to <strong>{studentName}</strong> (Student ID: <strong style={{ color: 'var(--purple-l)' }}>{studentId}</strong>)
            </p>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--red)', borderRadius: '8px', color: 'var(--red)', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
            Loading available institution exams...
          </div>
        ) : (
          <div id="examsContainer">
            {subjects.length === 0 ? (
              <div className="section-card">
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
                  <h3>No Published Exams Available Yet</h3>
                  <p style={{ marginTop: '6px' }}>Exams published by your institution will appear here automatically.</p>
                </div>
              </div>
            ) : (
              subjects.map((subjGroup) => (
                <div key={subjGroup.subject} className="section-card" style={{ marginBottom: '24px' }}>
                  <div className="section-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--text)' }}>
                      📚 {subjGroup.subject}
                    </h2>
                    <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                      {subjGroup.available_exams} {subjGroup.available_exams === 1 ? 'Exam' : 'Exams'} Available
                    </span>
                  </div>

                  <div className="section-body" style={{ padding: 0 }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {subjGroup.exams.map((exam) => {
                        const defaultSet = getAssignedSetForStudent(exam.sets, studentId);
                        const defaultSetId = defaultSet ? defaultSet.exam_set_id : (exam.exam_id || '');

                        const localSubs = JSON.parse(localStorage.getItem('vyasaprep_submissions') || '[]');
                        const curId = String(studentId || localStorage.getItem('vyasaprep_active_student_id') || '').toLowerCase().trim();
                        const isCompleted = localSubs.some(s => {
                          if (!s || !curId) return false;
                          const sId = String(s.student_id || s.user_id || s.sub || '').toLowerCase().trim();
                          const matchesStudent = sId === curId || (curId && sId && (sId.includes(curId) || curId.includes(sId)));
                          if (!matchesStudent) return false;

                          return (
                            (s.exam_set_id && defaultSetId && s.exam_set_id === defaultSetId) ||
                            (s.exam_id && (s.exam_id === exam.exam_id || s.exam_id === exam.id)) ||
                            (s.exam_name && exam.exam_name && String(s.exam_name).toLowerCase().trim() === String(exam.exam_name).toLowerCase().trim())
                          );
                        });

                        return (
                          <li
                            key={exam.exam_id || exam.id}
                            style={{
                              padding: '20px',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--blue)' }}>
                                  {exam.exam_name || `${subjGroup.subject} Examination`}
                                </div>
                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(124, 58, 237, 0.15)', color: 'var(--purple-l)', fontWeight: 600 }}>
                                  60 MCQs
                                </span>
                                {isCompleted && (
                                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                                    ✓ Completed (1 Attempt Limit)
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>
                                Subject: <strong style={{ color: 'var(--text)' }}>{subjGroup.subject}</strong> • ⏱ {exam.duration_minutes || 60} Mins • 🎯 Max Marks: {exam.total_marks || 60}
                                {exam.scheduled_end && (
                                  <span style={{ marginLeft: '10px', color: '#eab308' }}>
                                    📅 Due {new Date(exam.scheduled_end).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              to={`/exam?set=${defaultSetId}&subject=${encodeURIComponent(subjGroup.subject)}&name=${encodeURIComponent(exam.exam_name || subjGroup.subject)}&label=${defaultSet?.set_label || 'A'}`}
                              className="btn-primary"
                              style={{ minWidth: '130px', textAlign: 'center' }}
                            >
                              Take Set {defaultSet?.set_label || 'A'} →
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default StudentInstitutionExams;
