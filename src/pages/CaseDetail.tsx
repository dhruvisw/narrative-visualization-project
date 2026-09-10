import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';
import { ArrowRight } from 'lucide-react';
// Minimum engagement time for non-video cases (seconds)
const MIN_READING_TIME = 45;
const VIDEO_CONTINUE_DELAY_MS = 15_000;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const caseId = parseInt(id || '1');
  const caseStudy = caseStudies.find((c) => c.id === caseId);
  const hasVideo = caseId === 1;

  const [showNext, setShowNext] = useState(false);
  const playerRef = useRef<any>(null);

  // Time spent on the page controls Continue availability.
  useEffect(() => {
    const timer = setTimeout(
      () => setShowNext(true),
      hasVideo ? VIDEO_CONTINUE_DELAY_MS : MIN_READING_TIME * 1000,
    );
    return () => clearTimeout(timer);
  }, [hasVideo]);

  // YouTube IFrame API for case 1
  const initPlayer = useCallback(() => {
    if (!hasVideo) return;

    const createPlayer = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: 'R38FR2y53_w',
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      // Load the API script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [hasVideo]);

  useEffect(() => {
    const cleanup = initPlayer();
    return () => cleanup?.();
  }, [initPlayer]);

  if (!caseStudy) {
    return (
      <PageWrapper showNav={false}>
        <div className="page-container text-center">
          <h1 className="heading-display">Case not found</h1>
        </div>
      </PageWrapper>
    );
  }

  const handleNext = () => {
    navigate(`/case-transition/${caseId}`);
  };

  return (
    <PageWrapper showNav={false}>
      <div className="page-container max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Case Story {caseId} of 4
          </span>
          <h1 className="heading-display text-3xl md:text-4xl mb-4">
            {caseId === 1 ? "A Student's Turning Point with Ketamine" : caseStudy.title}
          </h1>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-sage-light text-sage text-sm font-medium">
              {caseStudy.outcome}
            </span>
            <span className="px-3 py-1 rounded-full bg-medical-light text-medical text-sm font-medium">
              {caseStudy.duration}
            </span>
            <span className="px-3 py-1 rounded-full bg-clay-light text-clay text-sm font-medium">
              {caseStudy.trigger}
            </span>
          </div>
        </motion.header>

        {/* Media */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {hasVideo ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div id="yt-player" className="absolute inset-0 w-full h-full" />
              </div>
            ) : (
              <img
                src={caseStudy.image}
                alt={caseStudy.imageAlt}
                className="w-full h-64 md:h-80 object-cover"
              />
            )}
          </div>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6 mb-8"
        >
          <div className="section-card">
            <h2 className="heading-section text-xl mb-3">Context</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{caseStudy.context}</p>
          </div>
          <div className="section-card">
            <h2 className="heading-section text-xl mb-3">Trigger</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{caseStudy.triggerDetail}</p>
          </div>
          <div className="section-card">
            <h2 className="heading-section text-xl mb-3">Treatment Path</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{caseStudy.treatmentPath}</p>
          </div>
          <div className="section-card">
            <h2 className="heading-section text-xl mb-3">Changes Over Time</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{caseStudy.changes}</p>
          </div>
          <div className="section-card">
            <h2 className="heading-section text-xl mb-3">Current Outcome</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{caseStudy.currentOutcome}</p>
          </div>
        </motion.div>

        {/* Source */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-6 border-t border-border text-center mb-8"
        >
          <p className="text-sm text-muted-foreground">
            Adapted from{' '}
            <a
              href={caseStudy.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {caseStudy.source}
            </a>
          </p>
        </motion.footer>

        {/* Gated Next Button */}
        <AnimatePresence>
          {showNext && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center pb-12"
            >
              <button
                onClick={handleNext}
                className="nav-button-primary group text-lg px-8 py-3"
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!showNext && (
          <p className="text-center text-sm text-muted-foreground pb-12">
            {hasVideo
              ? 'Continue will be available shortly.'
              : 'Take your time reading the story…'}
          </p>
        )}
      </div>
    </PageWrapper>
  );
};

export default CaseDetail;
