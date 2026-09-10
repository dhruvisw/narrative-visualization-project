import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { trackDashboardClick } from '@/lib/analytics';
import { markDashboardVisited } from '@/lib/surveyData';


const ChoiceScreen = () => {
  
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleDashboard = () => {
    localStorage.setItem('visited_dashboard', 'true');
    localStorage.setItem('user_path', 'dashboard');
    // Track only on deliberate user click
    trackDashboardClick();
    markDashboardVisited();
    navigate('/compare');
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
            className="text-3xl md:text-4xl font-serif leading-relaxed text-foreground/90"
          >
            You can now explore the data behind these journeys.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-24 h-1 bg-primary/30 mx-auto mt-8 rounded-full"
          />

          <AnimatePresence>
            {showButtons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={handleDashboard}
                  className="nav-button-secondary group text-lg px-8 py-3 inline-flex items-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  Explore Dashboard
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

export default ChoiceScreen;
