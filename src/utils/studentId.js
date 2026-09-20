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

export const generateStudentId = (student) => {
  if (!student) return 'VP101';

  const entryNumber = student.user_id || student.id || student.entry_number || 101;
  const isInstitutional =
    student.student_subtype === 'institutional' ||
    student.is_institutional ||
    Boolean(student.institution_name) ||
    Boolean(student.institution_id) ||
    Boolean(student.join_code);

  if (isInstitutional) {
    const instName = student.institution_name || student.institution_code || student.join_code || 'INST';
    const initials = getInstitutionInitials(instName);
    return `${initials}${entryNumber}`;
  }

  return `VP${entryNumber}`;
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
