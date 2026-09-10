import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import homepageBackground from '@/assets/homepage-background.jpg';

const Transition = () => {
  // Mouse position tracking for parallax
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
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth);
      mouseY.set(clientY / innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <PageWrapper>
      {/* Animated background image with parallax */}
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
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-2xl"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/90"
          >
            These are real journeys.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/70 mt-4"
          >
            They are not universal.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-primary mt-4"
          >
            Let's explore how they differ.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-24 h-1 bg-primary/30 mx-auto mt-12 rounded-full"
          />
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Transition;
