import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  trackVideoStart,
  trackVideoComplete,
  startPageTimer,
  endPageTimer,
} from '@/lib/analytics';
import { markVideoCompleted, startPageTime, sendPageTime } from '@/lib/surveyData';


const VIDEO_END_THRESHOLD = 20;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPage = () => {
  const navigate = useNavigate();
  const [showNext, setShowNext] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxReachedRef = useRef(0);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const userInteractedRef = useRef(false);

  // The YouTube iframe captures its own click events, so we cannot listen
  // on a wrapper div. When the user clicks INSIDE the iframe, the parent
  // window loses focus — that's our reliable proxy for a real user gesture.
  useEffect(() => {
    const onBlur = () => {
      // Only count blur if the active element is the YT iframe
      if (document.activeElement?.tagName === 'IFRAME') {
        userInteractedRef.current = true;
      }
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  const initPlayer = useCallback(() => {
    const createPlayer = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: 'R38FR2y53_w',
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          controls: 1,
        },
        events: {
          onStateChange: (e: any) => {
            const YT = window.YT;
            // PLAYING after a real user gesture → first true "play"
            if (
              e.data === YT?.PlayerState?.PLAYING &&
              !startedRef.current &&
              userInteractedRef.current
            ) {
              startedRef.current = true;
              trackVideoStart();
            }
            // ENDED → fire video_complete exactly once
            if (e.data === YT?.PlayerState?.ENDED && !completedRef.current) {
              completedRef.current = true;
              trackVideoComplete();
              markVideoCompleted();
              setShowNext(true);
            }
          },
          onReady: () => {
            intervalRef.current = setInterval(() => {
              const player = playerRef.current;
              if (!player?.getCurrentTime || !player?.getDuration) return;

              const currentTime = player.getCurrentTime();
              const duration = player.getDuration();

              // Anti-seek: revert if jumped ahead
              if (currentTime > maxReachedRef.current + 2) {
                player.seekTo(maxReachedRef.current, true);
              } else {
                maxReachedRef.current = Math.max(maxReachedRef.current, currentTime);
              }

              // Reveal Next button in last 20s (UI only — completion event
              // still fires from the ENDED state above)
              if (duration > 0 && duration - currentTime <= VIDEO_END_THRESHOLD) {
                setShowNext(true);
              }
            }, 1000);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    startPageTimer('video_page');
    startPageTime('video');
    const cleanup = initPlayer();
    return () => {
      cleanup?.();
      endPageTimer('video_page');
    };
  }, [initPlayer]);

  const handleNext = () => {
    endPageTimer('video_page');
    sendPageTime('video');
    navigate('/video-transition');
  };

  return (
    <PageWrapper showNav={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          {/* Video */}
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div id="yt-player" className="absolute inset-0 w-full h-full" />
            </div>
          </div>

          <p className="mt-3 text-center text-xs text-muted-foreground/60">
            Unable to load video?{' '}
            <a
              href="https://www.youtube.com/watch?v=R38FR2y53_w"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Watch on YouTube <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          {/* Gated Next Button */}
          <AnimatePresence>
            {showNext && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-10 text-center"
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
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please watch the video to continue.
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default VideoPage;
