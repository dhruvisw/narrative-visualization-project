import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Ordered learning flow (excluding Home)
const flowOrder = [
  '/about-depression',
  '/pre-video',
  '/video',
  '/video-transition',
  '/choice',
  '/compare',
  '/learned',
  '/bibliography',
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [aboutGateOpen, setAboutGateOpen] = useState(false);

  // Listen for gate event from AboutDepression page
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.allPhasesVisited) {
        setAboutGateOpen(true);
      }
    };
    window.addEventListener('about-depression-gate', handler);
    return () => window.removeEventListener('about-depression-gate', handler);
  }, []);

  // Reset gate when leaving about-depression
  useEffect(() => {
    if (path !== '/about-depression') {
      setAboutGateOpen(false);
    }
  }, [path]);

  const handleNavigate = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Don't render nav on Home page
  if (path === '/') return null;

  // Find current index in flow to determine "Next"
  const currentIndex = flowOrder.indexOf(path);
  const nextPath = currentIndex >= 0 && currentIndex < flowOrder.length - 1
    ? flowOrder[currentIndex + 1]
    : null;

  // Case story pages get Back/Next between cases
  const caseMatch = path.match(/^\/case\/(\d+)$/);
  const caseNum = caseMatch ? parseInt(caseMatch[1]) : null;
  const isCase = caseNum !== null && caseNum >= 1 && caseNum <= 4;

  // Determine if Next should be hidden until all depression phases are explored
  const isAboutPage = path === '/about-depression';
  const hideNext = isAboutPage && !aboutGateOpen;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Left side: Home or Back */}
          {isCase ? (
            caseNum! > 1 && (
              <button
                onClick={() => handleNavigate(`/case/${caseNum! - 1}`)}
                className="nav-button-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )
          ) : path === '/transition' ? (
            <button
              onClick={() => handleNavigate('/about-depression')}
              className="nav-button-secondary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {/* Right side: Next */}
          {!hideNext && (
            <>
              {isCase && (
                <button
                  onClick={() => handleNavigate(caseNum! < 4 ? `/case/${caseNum! + 1}` : '/video')}
                  className="nav-button-primary"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {!isCase && nextPath && (
                <button
                  onClick={() => handleNavigate(nextPath)}
                  className="nav-button-primary"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
