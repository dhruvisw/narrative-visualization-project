// GA4 structured research tracking with session-linked events.
// GA script is loaded in index.html.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// ── Environment ──────────────────────────────────────────────

export function getEnvironment(): 'preview' | 'production' {
  if (typeof window === 'undefined') return 'production';
  return window.location.hostname === 'localhost' ||
    window.location.hostname.includes('preview')
    ? 'preview'
    : 'production';
}

// ── Session (read-only – surveyData.ts owns the session) ─────

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('session_id', id);
  }
  return id;
}

export function bindGaUser(): void {
  const id = getSessionId();
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('set', { user_id: id });
    window.gtag('set', 'user_properties', { environment: getEnvironment() });
  }
}

// ── Low-level event helper ───────────────────────────────────

export function gaEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  // Skip tracking in preview/dev environments and when page is not focused
  if (getEnvironment() === 'preview') return;
  if (!document.hasFocus()) return;
  window.gtag('event', name, {
    session_id: getSessionId(),
    environment: getEnvironment(),
    ...params,
  });
}

// ── Standardized page names ──────────────────────────────────

export type StandardPage =
  | 'home'
  | 'pre_assessment'
  | 'about'
  | 'pre_video'
  | 'video'
  | 'transition'
  | 'choice'
  | 'dashboard'
  | 'post_assessment'
  | 'learned'
  | 'bibliography';

// ── Structured research events ───────────────────────────────

/** Fire on every page mount */
export function trackPageEnter(page: StandardPage): void {
  gaEvent('page_enter', { page_name: page });
}

/** Fire on page unmount / beforeunload with time spent */
export function trackPageExit(page: StandardPage, timeSpentSec: number): void {
  gaEvent('page_exit', { page_name: page, time_spent: timeSpentSec });
}

/** Fire when video playback starts */
export function trackVideoStart(): void {
  gaEvent('video_start');
}

/** Fire when user watches ≥90% of the video */
export function trackVideoComplete(): void {
  gaEvent('video_complete');
}

/** Fire ONLY when user clicks "Begin the Experience" on the home page */
export function trackExperienceStart(): void {
  gaEvent('experience_start');
}

/** Fire ONLY when user clicks "Explore Dashboard" on the choice screen */
export function trackDashboardClick(): void {
  gaEvent('dashboard_click');
}

/** Backward-compatible alias — prefer trackDashboardClick */
export const trackDashboardOpen = trackDashboardClick;

/** Fire when pre or post assessment is submitted */
export function trackAssessmentSubmit(type: 'pre' | 'post', gender?: string): void {
  const params: Record<string, unknown> = { type };
  if (gender) params.gender = gender;
  gaEvent('assessment_submit', params);
}

/** Fire on the final page with total elapsed seconds for the whole experience. */
export function trackSessionEnd(totalTimeSec: number): void {
  gaEvent('session_end', { total_time_seconds: totalTimeSec });
}

// ── Page-level time tracking (sessionStorage-backed) ─────────
//
// Call startPageTimer(name) when the user actively enters a tracked page
// (e.g. video, dashboard, post-assessment). Call endPageTimer(name) right
// before navigating away. Each call fires at most one `page_time` event
// per page entry — no duplicates on refresh, no auto-fire on render of
// untracked pages.

const PAGE_TIMER_PREFIX = 'page_timer_';

export type TrackedPage = 'video_page' | 'dashboard_page' | 'assessment_page';

export function startPageTimer(page: TrackedPage): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(`${PAGE_TIMER_PREFIX}${page}`, Date.now().toString());
}

export function endPageTimer(page: TrackedPage): void {
  if (typeof window === 'undefined') return;
  const key = `${PAGE_TIMER_PREFIX}${page}`;
  const raw = sessionStorage.getItem(key);
  if (!raw) return;
  const start = parseInt(raw, 10);
  sessionStorage.removeItem(key);
  if (!start || Number.isNaN(start)) return;
  const timeSpent = Math.floor((Date.now() - start) / 1000);
  if (timeSpent < 0) return;
  gaEvent('page_time', { page_name: page, time_spent: timeSpent });
}
