/**
 * Central Exam Store Utility for VyasaPrep
 * Manages persistent storage, API merging, subject grouping, and dynamic event broadcasting.
 */

const STORAGE_KEY = 'vyasaprep_institution_exams';

// Helper to ensure only authentic admin-created exams are accepted (no fake/seed mock tests)
const isAuthenticAdminExam = (exam) => {
  if (!exam) return false;
  const id = String(exam.exam_id || exam.id || '');
  const name = String(exam.exam_name || exam.name || '');
  if (id.startsWith('EXAM-SEED-')) return false;
  if (name.includes('Weekly Mock #1 - Calculus & Algebra')) return false;
  if (name.includes('Physics Practice Test - Electromagnetism')) return false;
  if (name.includes('Chemistry Full Length Mock') && id.startsWith('EXAM-SEED')) return false;
  return true;
};

export const getStoredExams = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [];
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      const filtered = parsed.filter(isAuthenticAdminExam);
      if (filtered.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
      return filtered;
    }
    return [];
  } catch (e) {
    console.error('Error reading stored exams:', e);
    return [];
  }
};

export const saveStoredExams = (newList) => {
  try {
    const cleanList = (newList || []).filter(isAuthenticAdminExam);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanList));
    window.dispatchEvent(new CustomEvent('exam-updated', { detail: { exams: cleanList } }));
    window.dispatchEvent(new Event('exam-created'));
    localStorage.setItem('vyasaprep_last_exam_created', String(Date.now()));
  } catch (e) {
    console.error('Error saving stored exams:', e);
  }
};

export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {}
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

export const addStoredExam = (exam) => {
  if (!isAuthenticAdminExam(exam)) return getStoredExams();
  const current = getStoredExams();
  // Ensure default sets exist if missing
  const examId = exam.exam_id || exam.id || `EXAM-${Date.now()}`;
  const preparedExam = {
    ...exam,
    exam_id: examId,
    id: examId,
    exam_name: exam.exam_name || exam.name || 'KCET Mock Examination',
    name: exam.exam_name || exam.name || 'KCET Mock Examination',
    sets: exam.sets && exam.sets.length > 0 ? exam.sets : [
      { exam_set_id: generateUUID(), set_label: 'A' },
      { exam_set_id: generateUUID(), set_label: 'B' },
      { exam_set_id: generateUUID(), set_label: 'C' },
      { exam_set_id: generateUUID(), set_label: 'D' }
    ]
  };

  const filtered = current.filter(e => e.exam_id !== preparedExam.exam_id && e.id !== preparedExam.exam_id && e.exam_name !== preparedExam.exam_name);
  const updated = [preparedExam, ...filtered];
  saveStoredExams(updated);
  return updated;
};

export const deleteStoredExam = (targetId) => {
  if (!targetId) return getStoredExams();
  const current = getStoredExams();
  const searchStr = String(targetId).toLowerCase().trim();
  const updated = current.filter(e => {
    if (!e) return false;
    const eId = String(e.exam_id || '').toLowerCase().trim();
    const id = String(e.id || '').toLowerCase().trim();
    const name = String(e.exam_name || e.name || '').toLowerCase().trim();
    return eId !== searchStr && id !== searchStr && name !== searchStr;
  });
  saveStoredExams(updated);
  return updated;
};

export const mergeExamsWithLocal = (apiExams = []) => {
  const localExams = getStoredExams();
  const mergedMap = new Map();

  // Load valid local exams first
  localExams.forEach(e => {
    if (isAuthenticAdminExam(e)) {
      const key = e.exam_id || e.id || e.exam_name;
      if (key) mergedMap.set(key, e);
    }
  });

  // Merge authoritative backend API exams created by admin
  if (Array.isArray(apiExams) && apiExams.length > 0) {
    apiExams.forEach(e => {
      if (isAuthenticAdminExam(e)) {
        const key = e.exam_id || e.id || e.exam_name;
        if (key) {
          const existing = mergedMap.get(key) || {};
          mergedMap.set(key, { ...existing, ...e });
        }
      }
    });
  }

  const finalExams = Array.from(mergedMap.values());
  saveStoredExams(finalExams);
  return finalExams;
};

export const normalizeExamSubjects = (examsList = []) => {
  const groupsMap = {};
  
  (examsList || []).forEach(ex => {
    if (!isAuthenticAdminExam(ex)) return;
    const subj = ex.subject || 'General';
    if (!groupsMap[subj]) {
      groupsMap[subj] = { subject: subj, exams: [], available_exams: 0 };
    }
    
    // Ensure sets exist
    const examId = ex.exam_id || ex.id || `EXAM-${Math.random()}`;
    const sets = ex.sets && ex.sets.length > 0 ? ex.sets : [
      { exam_set_id: generateUUID(), set_label: 'A' },
      { exam_set_id: generateUUID(), set_label: 'B' },
      { exam_set_id: generateUUID(), set_label: 'C' },
      { exam_set_id: generateUUID(), set_label: 'D' }
    ];
    
    groupsMap[subj].exams.push({ ...ex, sets });
    groupsMap[subj].available_exams += 1;
  });

  return Object.values(groupsMap);
};

export const subscribeToExamChanges = (callback) => {
  const handler = () => {
    callback(getStoredExams());
  };

  window.addEventListener('exam-updated', handler);
  window.addEventListener('exam-created', handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener('exam-updated', handler);
    window.removeEventListener('exam-created', handler);
    window.removeEventListener('storage', handler);
  };
};
