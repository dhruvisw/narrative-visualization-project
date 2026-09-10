import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight, Heart } from 'lucide-react';
import { startPageTime, sendPageTime } from '@/lib/surveyData';

import homepageBackground from '@/assets/homepage-background.jpg';

const WhatWeLearned = () => {
  
  const navigate = useNavigate();

  useEffect(() => {
    startPageTime('learned');
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
    <PageWrapper showNav={false}>
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

      <div className="page-container max-w-3xl mx-auto relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-display mb-6">What These Journeys Reveal</h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-card bg-gradient-to-br from-sage-light/30 via-card to-medical-light/20 py-12 px-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>

          <p className="narrative-text text-muted-foreground leading-relaxed max-w-2xl mx-auto text-lg">
            By now, you have seen how differently these journeys unfold. A steady climb toward relief, waves of progress and relapse, and a plateau that only shifts when something deeper is understood. The same diagnosis, yet entirely different paths. What this reveals is simple but often missed. Depression does not follow one direction, respond in one way, or come from a single cause. It evolves over time, shaped by each person's experience and the path they take. And when we begin to see it this way, the question changes. Not just what works, but what works for whom, and why. Because depression is not one story. It is many. And each one deserves to be seen.
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-2xl font-serif italic text-foreground/80 mb-4">
            "The wound is the place where the Light enters you."
          </p>
          <cite className="text-muted-foreground">— Rumi</cite>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => {
              sendPageTime('learned');
              navigate('/bibliography');
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
            className="nav-button-primary group text-lg px-8 py-3 inline-flex items-center gap-2"
          >
            Continue to References
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default WhatWeLearned;
