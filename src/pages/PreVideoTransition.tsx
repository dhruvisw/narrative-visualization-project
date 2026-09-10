import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight } from 'lucide-react';
import { startPageTime, sendPageTime } from '@/lib/surveyData';


const PreVideoTransition = () => {
  
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    startPageTime('pre-video');
    const timer = setTimeout(() => setShowButton(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    sendPageTime('pre-video');
    navigate('/video');
  };

  return (
    <PageWrapper showNav={false}>
      <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-foreground/90"
          >
            Depression does not follow a single path.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6 max-w-xl mx-auto"
          >
            Let's explore different narratives…
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-24 h-1 bg-primary/30 mx-auto mt-10 rounded-full"
          />

          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-10"
              >
                <button
                  onClick={handleContinue}
                  className="nav-button-primary group text-lg px-8 py-3"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PreVideoTransition;
