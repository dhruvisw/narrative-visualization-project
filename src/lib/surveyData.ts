// Structured survey data collection for research-grade dataset submission.
// Single global object matching the exact column structure for Google Sheets.

import { LIKERT_LABELS } from '@/data/assessmentQuestions';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbynwNc7sovxUKMEx7Wc_WkCWlucqvs_tdqskRIcO97kIfTwSBBQMuoKLZOoddGKSfo/exec';

const SUBMITTED_KEY = 'evaluation_submitted';
const VISITED_PAGES_KEY = 'visited_pages';
const DASHBOARD_VISITED_KEY = 'dashboard_visited';
const VIDEO_COMPLETED_KEY = 'video_completed';
const SESSION_START_KEY = 'session_start';
const SESSION_ENDED_KEY = 'session_ended';

// ── Helpers ──────────────────────────────────────────────────

export function getEnvironment(): 'preview' | 'production' {
  if (typeof window === 'undefined') return 'production';
  const h = window.location.hostname;
  return h === 'localhost' || h.includes('preview')
    ? 'preview'
    : 'production';
}

export function getSessionId(): string {
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = 'session_' + Date.now();
    localStorage.setItem('session_id', id);
  }
  return id;
}

function likertValue(raw: string | number | undefined): { label: string; value: number | '' } {
  if (raw === undefined || raw === null || raw === '') return { label: '', value: '' };
  const num = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
  return { label: LIKERT_LABELS[num - 1] ?? '', value: num };
}

function yesNoValue(raw: string | undefined): { label: string; value: number | '' } {
  if (!raw) return { label: '', value: '' };
  if (raw === 'Yes') return { label: 'Yes', value: 1 };
  if (raw === 'No') return { label: 'No', value: 0 };
  return { label: raw, value: '' };
}

function loadResponses(key: string): Record<string, string | number> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw).responses || {};
  } catch {
    return {};
  }
}

function formatReadableTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ── Page tracking ────────────────────────────────────────────

export function trackPageVisit(pathname: string): void {
  const existing = localStorage.getItem(VISITED_PAGES_KEY) || '';
  const pages = existing ? existing.split(',') : [];
  if (!pages.includes(pathname)) {
    pages.push(pathname);
    localStorage.setItem(VISITED_PAGES_KEY, pages.join(','));
  }
}

export function markDashboardVisited(): void {
  // Only mark in production with active user focus
  if (getEnvironment() === 'preview' || !document.hasFocus()) return;
  localStorage.setItem(DASHBOARD_VISITED_KEY, 'true');
}

export function markVideoCompleted(): void {
  localStorage.setItem(VIDEO_COMPLETED_KEY, 'true');
}

/** Call ONLY when user clicks "Begin the Experience" on home page */
export function startSession(): void {
  localStorage.setItem(SESSION_START_KEY, Date.now().toString());
  localStorage.removeItem(SESSION_ENDED_KEY);
  localStorage.removeItem(SUBMITTED_KEY);
}

export function getSessionStart(): number {
  return parseInt(localStorage.getItem(SESSION_START_KEY) || '0', 10);
}

function formatHHMMSS(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS
}

// ── Page-level time tracking → Google Sheets ─────────────────
// Standalone time tracker that posts ONE entry per page to the
// Apps Script "page_tracking" sheet. Triggered ONLY on intentional
// navigation (button click). Does NOT use beforeunload, GA, or auto-fire.

export type TrackedPageName =
  | 'pre-assessment'
  | 'pre-video'
  | 'video'
  | 'dashboard'
  | 'post-assessment'
  | 'learned'
  | 'bibliography';

const PAGE_START_KEY = 'page_start_time';
const PAGE_NAME_KEY = 'current_page';
const PAGE_SENT_PREFIX = 'page_time_sent_';

/** Call on page mount. Stores start time + page name in sessionStorage. */
export function startPageTime(pageName: TrackedPageName): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(PAGE_START_KEY, Date.now().toString());
  sessionStorage.setItem(PAGE_NAME_KEY, pageName);
  // Clear any previous "sent" flag for this page so a fresh visit re-tracks
  sessionStorage.removeItem(`${PAGE_SENT_PREFIX}${pageName}`);
}

/** Call on intentional navigation click. Sends ONE entry, then resets timer. */
export function sendPageTime(pageName: TrackedPageName): void {
  if (typeof window === 'undefined') return;

  // Guard: only fire once per page visit
  const sentKey = `${PAGE_SENT_PREFIX}${pageName}`;
  if (sessionStorage.getItem(sentKey) === 'true') return;

  const startRaw = sessionStorage.getItem(PAGE_START_KEY);
  const start = startRaw ? parseInt(startRaw, 10) : 0;
  const timeSpent = start ? Math.floor((Date.now() - start) / 1000) : 0;
  if (timeSpent < 0) return;

  // Ensure session_id exists in spec format
  if (!localStorage.getItem('session_id')) {
    localStorage.setItem('session_id', 'session_' + Date.now());
  }

  const payload = {
    session_id: localStorage.getItem('session_id'),
    page_name: window.location.pathname,
    time_spent_seconds: timeSpent,
    event_type: 'page_time',
    sheet: 'page_tracking',
  };

  console.log('Sending to Sheets:', payload);

  // Use text/plain to avoid CORS preflight; Apps Script parses e.postData.contents as JSON
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
    .then(() => console.log('[PageTime] Sent:', pageName, timeSpent + 's'))
    .catch((err) => console.error('[PageTime] Error:', err));

  sessionStorage.setItem(sentKey, 'true');
  // Reset timer for the next page
  sessionStorage.setItem(PAGE_START_KEY, Date.now().toString());
  sessionStorage.setItem(PAGE_NAME_KEY, pageName);
}

// ── Build final payload ──────────────────────────────────────

export interface SurveyPayload {
  [key: string]: unknown;
}

export function buildSurveyData(): SurveyPayload {
  const sessionId = getSessionId();
  const startMs = getSessionStart();
  const endMs = Date.now();
  const totalSec = startMs ? Math.round((endMs - startMs) / 1000) : 0;

  const preAnswers = loadResponses('pre_assessment_responses');
  const postAnswers = loadResponses('post_assessment_responses');

  // Gender from pre Q10
  const rawGender = (preAnswers['pre_gender'] as string) || '';
  const gender = rawGender.startsWith('Other:')
    ? rawGender.slice(6).trim() || 'Other'
    : rawGender;

  // Flat payload — keys MUST match Google Sheets column headers EXACTLY.
  const data: SurveyPayload = {
    session_id: sessionId,
    environment: getEnvironment(),
    gender,
  };
  // Reference unused locals to avoid TS warnings (kept for potential future use)
  void startMs; void endMs; void totalSec;

  // ── Pre-assessment Q1–Q11 ──
  // Q1: pre_learned_before (multiple-choice, label only)
  data.pre_Q1_label = (preAnswers['pre_learned_before'] as string) || '';
  data.pre_Q1_value = (preAnswers['pre_learned_before'] as string) || '';

  // Q2: pre_supported_someone (Yes/No → 1/0)
  const q2 = yesNoValue(preAnswers['pre_supported_someone'] as string);
  data.pre_Q2_label = q2.label;
  data.pre_Q2_value = q2.value;

  // Q3–Q9: likert questions (indices 2–8 in preAssessmentQuestions)
  const preLikertIds = [
    'pre_change_over_time',       // Q3
    'pre_differs_between_people', // Q4
    'pre_same_for_everyone',      // Q5
    'pre_only_sadness',           // Q6
    'pre_life_context_shapes_depression', // Q7
    'pre_imagine_living_with_depression', // Q8
    'pre_snap_out_if_tried_harder',       // Q9
  ];
  preLikertIds.forEach((id, i) => {
    const qNum = i + 3;
    const { label, value } = likertValue(preAnswers[id]);
    data[`pre_Q${qNum}_label`] = label;
    data[`pre_Q${qNum}_value`] = value;
  });

  // Q10: gender — already stored in `gender` field above, skip dedicated Q
  // Q11: short-answer text
  data.pre_Q11_text = (preAnswers['pre_journey_differences'] as string) || '';

  // ── Post-assessment Q1–Q11 ──
  // Q1: post_used_comparative_dashboard (Yes/No → 1/0)
  const postQ1 = yesNoValue(postAnswers['post_used_comparative_dashboard'] as string);
  data.post_Q1_label = postQ1.label;
  data.post_Q1_value = postQ1.value;

  // Q2–Q8: likert (indices 1–7 in postAssessmentQuestions)
  const postLikertIds = [
    'post_understand_shift_over_time',       // Q2
    'post_understand_differs_between_people', // Q3
    'post_still_same_for_everyone',          // Q4
    'post_still_only_sadness',               // Q5
    'post_understand_life_context',          // Q6
    'post_more_able_to_imagine',             // Q7
    'post_still_snap_out',                   // Q8
  ];
  postLikertIds.forEach((id, i) => {
    const qNum = i + 2;
    const { label, value } = likertValue(postAnswers[id]);
    data[`post_Q${qNum}_label`] = label;
    data[`post_Q${qNum}_value`] = value;
  });

  // Q9: short-answer text
  data.post_Q9_text = (postAnswers['post_two_differences_noticed'] as string) || '';

  // Q10: likert
  const postQ10 = likertValue(postAnswers['post_website_helped_notice_differences']);
  data.post_Q10_label = postQ10.label;
  data.post_Q10_value = postQ10.value;

  // Q11: short-answer (feedback)
  data.post_Q11_text = (postAnswers['post_feedback_suggestions'] as string) || '';

  // ── Behavioral tracking ──
  data.visited_pages = localStorage.getItem(VISITED_PAGES_KEY) || '';
  data.dashboard_visited = localStorage.getItem(DASHBOARD_VISITED_KEY) === 'true';
  data.video_completed = localStorage.getItem(VIDEO_COMPLETED_KEY) === 'true';

  return data;
}

// ── Per-assessment immediate submit ──────────────────────────

/**
 * Fire a POST to Apps Script with the current assessment payload.
 * Used by the Pre/Post assessment submit buttons so each click reliably
 * produces a network request + visible console logs. Does not gate on
 * prior submissions and does not touch page-tracking logic.
 */
export function submitAssessmentNow(
  which: 'pre' | 'post',
  responses: Record<string, string | number>,
): void {
  // Persist responses so the final aggregate payload (bibliography) still works
  try {
    localStorage.setItem(`${which}_assessment_responses`, JSON.stringify({
      session_id: getSessionId(),
      timestamp: Date.now(),
      responses,
    }));
  } catch (e) {
    console.warn('[Assessment] Could not persist responses', e);
  }

  const payload = buildSurveyData();
  (payload as Record<string, unknown>).assessment_stage = which;
  (payload as Record<string, unknown>).sheet = which === 'pre' ? 'pre_assessment' : 'post_assessment';

  console.log('Submitting assessment:', payload);

  // Use text/plain to avoid CORS preflight; Apps Script reads e.postData.contents as JSON
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
    .then((res) => res.text())
    .then((res) => console.log('SUCCESS [' + which + ']:', res))
    .catch((err) => console.error('ERROR [' + which + ']:', err));
}

// ── Submit once ──────────────────────────────────────────────

/**
 * End the session, build payload, and submit ONCE.
 * Call this on the bibliography (final) page.
 * Returns { ok, status, response } so the caller can surface a confirmation toast.
 */
export async function endSessionAndSubmit(): Promise<{
  ok: boolean;
  status: number;
  response: string;
  alreadySubmitted?: boolean;
}> {
  // Prevent multiple submissions
  if (localStorage.getItem(SESSION_ENDED_KEY) === 'true') {
    console.log('[Survey] Session already ended, skipping.');
    return { ok: true, status: 200, response: 'Already submitted', alreadySubmitted: true };
  }

  const data = buildSurveyData();
  const sessionId = data.session_id as string;

  if (localStorage.getItem(SUBMITTED_KEY) === sessionId) {
    console.log('[Survey] Already submitted for session', sessionId);
    return { ok: true, status: 200, response: 'Already submitted', alreadySubmitted: true };
  }

  // Ensure no undefined values
  for (const key of Object.keys(data)) {
    if (data[key] === undefined || data[key] === null) {
      data[key] = '';
    }
  }

  const body = JSON.stringify(data);
  console.log('[Survey] Submitting:', data);

  try {
    // Use a readable CORS request so we can return the server response.
    // text/plain avoids a CORS preflight; Apps Script parses e.postData.contents as JSON.
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow',
    });

    const text = await res.text();
    console.log('[Survey] Response', res.status, text);

    if (res.ok) {
      localStorage.setItem(SUBMITTED_KEY, sessionId);
      localStorage.setItem(SESSION_ENDED_KEY, 'true');
      localStorage.removeItem(SESSION_START_KEY);
    }

    return { ok: res.ok, status: res.status, response: text };
  } catch (err) {
    console.error('[Survey] Failed to submit:', err);
    return {
      ok: false,
      status: 0,
      response: err instanceof Error ? err.message : String(err),
    };
  }
}
