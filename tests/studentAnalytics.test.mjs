import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSubmissionResult, buildAiAnalysisFromSubmissions } from '../src/utils/studentAnalytics.js';

test('normalizeSubmissionResult prefers authoritative backend stats over local fallback', () => {
  const merged = normalizeSubmissionResult(
    {
      score: 15,
      total_marks: 60,
      percentage: 25,
      correct_count: 15,
      incorrect_count: 4,
      unanswered_count: 41,
      ai_analysis: { summary: { score: 11 } }
    },
    {
      score: 20,
      total_marks: 60,
      percentage: 33,
      correct_count: 20,
      incorrect_count: 10,
      unanswered_count: 30,
      ai_analysis: { summary: { score: 11 } }
    }
  );

  assert.equal(merged.score, 15);
  assert.equal(merged.correct_count, 15);
  assert.equal(merged.incorrect_count, 4);
  assert.equal(merged.unanswered_count, 41);
  assert.equal(merged.percentage, 25);
});

test('buildAiAnalysisFromSubmissions groups real exam attempts into strength bands', () => {
  const summary = buildAiAnalysisFromSubmissions([
    { subject: 'Biology', percentage: 15 },
    { subject: 'Biology', percentage: 6.7 },
    { subject: 'Chemistry', percentage: 10 },
    { subject: 'Biology', percentage: 13.3 }
  ]);

  assert.deepEqual(summary.strong_areas, []);
  assert.deepEqual(summary.can_improve_areas, []);
  assert.deepEqual(summary.weak_areas, ['Biology (12%)', 'Chemistry (10%)']);
});
