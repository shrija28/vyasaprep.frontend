export const toNumber = (value, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

export const normalizeSubmissionResult = (apiResult = {}, fallbackResult = {}) => {
  const source = apiResult && typeof apiResult === 'object' ? apiResult : {};
  const fallback = fallbackResult && typeof fallbackResult === 'object' ? fallbackResult : {};

  const totalMarks = toNumber(
    source.total_marks ?? source.total_questions ?? source.total ?? fallback.total_marks ?? fallback.total_questions ?? fallback.total ?? 0,
    0
  );

  const score = toNumber(
    source.score ?? source.marks ?? source.points ?? fallback.score ?? fallback.marks ?? fallback.points ?? 0,
    0
  );

  const percentage = toNumber(
    source.percentage ?? source.score_pct ?? source.score_percent ?? fallback.percentage ?? fallback.score_pct ?? fallback.score_percent ?? 0,
    0
  );

  const safeCorrect = toNumber(
    source.correct_count ?? source.correct ?? source.correct_answers ?? fallback.correct_count ?? fallback.correct ?? fallback.correct_answers ?? score,
    0
  );

  const safeUnanswered = toNumber(
    source.unanswered_count ?? source.skipped_count ?? source.unanswered ?? source.unanswered_questions ?? fallback.unanswered_count ?? fallback.skipped_count ?? fallback.unanswered ?? fallback.unanswered_questions ?? 0,
    0
  );

  const safeIncorrect = toNumber(
    source.incorrect_count ?? source.wrong_count ?? source.incorrect ?? source.wrong_answers ?? fallback.incorrect_count ?? fallback.wrong_count ?? fallback.incorrect ?? fallback.wrong_answers ?? Math.max(0, totalMarks - safeCorrect - safeUnanswered),
    0
  );

  const normalizedCorrect = Math.max(0, safeCorrect);
  const normalizedUnanswered = Math.max(0, safeUnanswered);
  const normalizedIncorrect = Math.max(0, safeIncorrect);

  return {
    ...fallback,
    ...source,
    score,
    total_marks: totalMarks,
    percentage,
    correct_count: normalizedCorrect,
    incorrect_count: normalizedIncorrect,
    unanswered_count: normalizedUnanswered,
    status: source.status || fallback.status || (percentage >= 40 ? 'Pass' : 'Fail')
  };
};

export const buildAiAnalysisFromSubmissions = (submissions = []) => {
  const filtered = Array.isArray(submissions) ? submissions.filter(Boolean) : [];

  const groups = filtered.reduce((acc, item) => {
    const subject = String(item.subject || item.exam_subject || item.category || 'General').trim() || 'General';
    const percentage = toNumber(item.percentage ?? item.score_pct ?? item.score_percent ?? item.score ?? 0, 0);
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(percentage);
    return acc;
  }, {});

  const strong = [];
  const improve = [];
  const weak = [];

  Object.entries(groups).forEach(([subject, scores]) => {
    const avg = scores.reduce((sum, score) => sum + score, 0) / Math.max(1, scores.length);
    const label = `${subject} (${Math.round(avg)}%)`;
    if (avg >= 75) {
      strong.push(label);
    } else if (avg >= 50 && avg <= 74) {
      improve.push(label);
    } else {
      weak.push(label);
    }
  });

  return {
    strong_areas: strong.sort(),
    can_improve_areas: improve.sort(),
    weak_areas: weak.sort(),
    subject_averages: Object.fromEntries(Object.entries(groups).map(([subject, scores]) => {
      const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return [subject, Number(avg.toFixed(1))];
    }))
  };
};
