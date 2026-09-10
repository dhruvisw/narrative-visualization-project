import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { type StandardPage, trackPageEnter, trackPageExit } from '@/lib/analytics';
import { trackPageVisit } from '@/lib/surveyData';

/**
 * Maps pathname → StandardPage. Returns null for unknown routes.
 */
function toStandardPage(pathname: string): StandardPage | null {
  const map: Record<string, StandardPage> = {
    '/': 'home',
    '/about-depression': 'about',
    '/pre-video': 'pre_video',
    '/video': 'video',
    '/video-transition': 'transition',
    '/choice': 'choice',
    '/compare': 'dashboard',
    '/learned': 'learned',
    '/bibliography': 'bibliography',
  };
  return map[pathname] ?? null;
}

/**
 * Centralized SPA route tracker.
 * Place once inside <BrowserRouter>.
 *
 * - Fires page_enter exactly once per route change.
 * - Fires page_exit (with time_spent in seconds) before navigating away.
 * - Does NOT rely on beforeunload.
 * - Guards against React Strict Mode double-mount.
 */
export default function RouteTracker() {
  const location = useLocation();
  const prevPageRef = useRef<StandardPage | null>(null);
  const startRef = useRef<number>(Date.now());
  const lastFiredPathRef = useRef<string>('');

  useEffect(() => {
    // Guard: skip if we already fired for this exact pathname
    if (location.pathname === lastFiredPathRef.current) return;
    lastFiredPathRef.current = location.pathname;

    const currentPage = toStandardPage(location.pathname);

    // Fire exit for the previous page
    if (prevPageRef.current) {
      const sec = Math.round((Date.now() - startRef.current) / 1000);
      trackPageExit(prevPageRef.current, sec);
    }

    // Fire enter for the new page
    if (currentPage) {
      startRef.current = Date.now();
      trackPageEnter(currentPage);
    }

    // Track visited page for survey data
    trackPageVisit(location.pathname);

    prevPageRef.current = currentPage;
  }, [location.pathname]);

  return null;
}
