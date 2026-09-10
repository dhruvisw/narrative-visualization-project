import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';

const caseLabels = [
  { ageRange: 'Ketamine Treatment' },
  { ageRange: '45 years old' },
  { ageRange: '38 years old' },
  { ageRange: '24 years old' },
];

const CaseCard = ({ study, index }: { study: typeof caseStudies[0]; index: number }) => {
  const navigate = useNavigate();
  const label = caseLabels[index];

  const handleClick = () => {
    navigate(`/case/${study.id}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
      onClick={handleClick}
      className="bg-card rounded-xl p-5 shadow-md border border-border/50 cursor-pointer transition-colors duration-200 hover:border-primary/50 hover:ring-2 hover:ring-primary/20 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Case {study.id}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          {label.ageRange}
        </span>
      </div>

      <h3 className="font-serif text-xl font-medium mb-3">{study.id === 1 ? "A Student's Turning Point with Ketamine" : study.title}</h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sage-light text-sage text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          {study.outcome}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-medical-light text-medical text-xs font-medium">
          <Clock className="w-3 h-3" />
          {study.duration}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-clay-light text-clay text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          {study.trigger}
        </span>
      </div>

      {/* Button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-auto"
      >
        {study.id === 1 ? 'Explore Case Story' : 'Explore This Journey'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.article>
  );
};

const CaseSelection = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen relative z-10 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-16 pb-6 px-6"
        >
          <h1 className="heading-display mb-3">Four Real Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground max-w-xl text-base">
            These are independent stories, each illustrating a different path through depression.
            Explore any that resonate with you.
          </p>
        </motion.header>

        {/* 2x2 Grid */}
        <div className="flex-1 px-6 pb-8 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {caseStudies.map((study, index) => (
              <CaseCard key={study.id} study={study} index={index} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-muted-foreground pb-8 px-6"
        >
          All cases are based on real, peer-reviewed clinical studies. Names and identifying details have been changed.
        </motion.p>
      </div>
    </PageWrapper>
  );
};

export default CaseSelection;
