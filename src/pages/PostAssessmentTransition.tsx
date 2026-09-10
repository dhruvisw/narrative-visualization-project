import { useEffect, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight } from 'lucide-react';
import homepageBackground from '@/assets/homepage-background.jpg';
import { getSessionId } from '@/lib/surveyData';

const POST_ASSESSMENT_BASE =
  'https://docs.google.com/forms/d/e/1FAIpQLSdqHfxqKc8_5eXh6LHc_a2SVD5Wo833ckp1NXsZvm-VdRi0Yw/viewform?usp=header';

const PostAssessmentTransition = () => {
  // Finalize evaluation data and build survey URL with session_id
  const surveyUrl = useMemo(() => {
    const sessionId = getSessionId();
    return `${POST_ASSESSMENT_BASE}&entry.1234567890=${encodeURIComponent(sessionId)}`;
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const bgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [0, 1], [-10, 10]);
  const bgScale = useTransform(smoothY, [0, 1], [1.05, 1.1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <PageWrapper>
      <motion.div
        className="fixed inset-[-20px] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.4,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/40 pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none z-0"
      />

      <div className="min-h-[80vh] flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/90"
          >
            One Final Step in the Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6 max-w-xl mx-auto"
          >
            You've explored stories, phases, and comparisons. Now take a moment
            to reflect on what you've learned.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="w-24 h-1 bg-primary/30 mx-auto mt-10 rounded-full"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-10"
          >
            <a
              href={surveyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-button-primary group text-lg px-8 py-3 inline-flex items-center gap-2"
            >
              Continue to Post-Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PostAssessmentTransition;
