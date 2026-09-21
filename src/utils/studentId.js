/**
 * Generates/formats Student ID according to VyasaPrep rules:
 * - Institutional Student: First letters of institution name followed by entry number (e.g., NPS101, VI102)
 * - Individual Student: "VP" followed by entry number (e.g., VP101, VP102)
 */

export const getInstitutionInitials = (institutionName) => {
  if (!institutionName) return 'INST';
  const cleaned = String(institutionName).trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    return words.map((w) => w[0].toUpperCase()).join('');
  }
  return cleaned.slice(0, 3).toUpperCase();
};

export const generateStudentId = (student, index) => {
  if (!student) {
    const numStr = typeof index === 'number' ? String(index + 1).padStart(3, '0') : '001';
    return `SMVITM-${numStr}`;
  }

  const isInstitutional =
    student.student_subtype === 'institutional' ||
    student.is_institutional ||
    Boolean(student.institution_name) ||
    Boolean(student.institution_id) ||
    Boolean(student.join_code);

  const instName = student.institution_name || student.institution_code || student.join_code || 'SMVITM';
  const initials = isInstitutional ? getInstitutionInitials(instName) : 'VP';

  // If explicit numeric index passed (e.g. mapping over array in list views)
  if (typeof index === 'number' && !isNaN(index) && index >= 0) {
    const numStr = String(index + 1).padStart(3, '0');
    return `${initials}-${numStr}`;
  }

  // Check existing student ID fields
  const existingId = student.kcet_student_id || student.studentId || (student.sub && !student.sub.includes('@') ? student.sub : '');
  if (existingId && String(existingId).trim()) {
    const str = String(existingId).trim();
    // If it has format like "SMVITM-101" or "SMVITM-1", normalize digits starting from 001
    const parts = str.split('-');
    if (parts.length === 2 && /^\d+$/.test(parts[1])) {
      const num = parseInt(parts[1], 10);
      const normVal = (num >= 101 && num < 1000) ? (num - 100) : num;
      const numStr = String(normVal).padStart(3, '0');
      return `${parts[0]}-${numStr}`;
    }
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      const normVal = (num >= 101 && num < 1000) ? (num - 100) : num;
      return `${initials}-${String(normVal).padStart(3, '0')}`;
    }
    return str;
  }

  // Extract digits from raw user_id / entry_number / id
  let rawId = student.student_id || student.entry_number || student.user_id || student.id || 1;
  let numVal = 1;

  if (typeof rawId === 'number' && !isNaN(rawId)) {
    numVal = rawId;
  } else if (typeof rawId === 'string') {
    const digits = rawId.match(/\d+/g);
    if (digits && digits.length > 0) {
      numVal = parseInt(digits[digits.length - 1], 10);
    }
  }

  // Normalize legacy DB offsets e.g. 101 -> 1 ("001"), 102 -> 2 ("002")
  if (numVal >= 101 && numVal < 1000) {
    numVal = numVal - 100;
  }

  if (isNaN(numVal) || numVal <= 0) numVal = 1;

  const numStr = String(numVal).padStart(3, '0');
  return `${initials}-${numStr}`;
};

/**
 * Deterministically assigns paper set (Set A, Set B, Set C, Set D) simultaneously to students based on Student ID.
 */
export const getAssignedSetForStudent = (sets, studentIdStr) => {
  if (!sets || !Array.isArray(sets) || sets.length === 0) return null;
  const idStr = String(studentIdStr || 'STD-001');
  const digitsMatch = idStr.match(/\d+/g);
  let assignedIndex = 0;
  if (digitsMatch && digitsMatch.length > 0) {
    const val = parseInt(digitsMatch[digitsMatch.length - 1], 10);
    if (!isNaN(val) && val > 0) {
      assignedIndex = (val - 1) % sets.length;
    }
  } else {
    let numHash = 0;
    for (let i = 0; i < idStr.length; i++) {
      numHash = (numHash * 31 + idStr.charCodeAt(i)) >>> 0;
    }
    assignedIndex = numHash % sets.length;
  }
  return sets[assignedIndex] || sets[0];
};

/**
 * Robustly extracts & formats student display name from profile object, email, or local storage.
 */
export const extractStudentName = (obj) => {
  if (!obj) {
    try {
      const stored = localStorage.getItem('user');
      if (stored) return extractStudentName(JSON.parse(stored));
    } catch {}
    return 'Student';
  }

  const candidate = obj.name || obj.full_name || obj.student_name || obj.display_name ||
                    obj.username || obj.user_name || obj.student?.name || obj.student?.full_name ||
                    obj.user?.name || obj.user?.full_name || '';

  if (candidate && typeof candidate === 'string' && candidate.trim().length > 0) {
    const trimmed = candidate.trim();
    if (!/^\d+$/.test(trimmed) && !trimmed.includes('@')) {
      return trimmed;
    }
  }

  const email = obj.email || obj.user_email || obj.user?.email || obj.student?.email || '';
  if (email && typeof email === 'string' && email.includes('@')) {
    const handle = email.split('@')[0];
    const formatted = handle
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
    if (formatted.length > 0) return formatted;
  }

  try {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed !== obj) {
        const storedName = extractStudentName(parsed);
        if (storedName && storedName !== 'Student') return storedName;
      }
    }
  } catch {}

  return 'Student';
};

