import { ReactNode, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navigation from './Navigation';
import homepageBackground from '@/assets/homepage-background.jpg';

interface PageWrapperProps {
  children: ReactNode;
  showNav?: boolean;
}

const PageWrapper = ({ 
  children, 
  showNav = true 
}: PageWrapperProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const bgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [0, 1], [-10, 10]);
  const bgScale = useTransform(smoothY, [0, 1], [1.05, 1.1]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen">
      {/* Global parallax background */}
      <motion.div
        className="fixed inset-[-20px] pointer-events-none z-0"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.35,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-background via-background/70 to-background/50 pointer-events-none z-0" />

      {showNav && <Navigation />}
      <main className={`relative z-10 ${showNav ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default PageWrapper;
