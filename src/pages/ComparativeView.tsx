import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { caseStudies } from '@/data/caseStudies';
import { Filter } from 'lucide-react';
import homepageBackground from '@/assets/homepage-background.jpg';

type FilterType = 'outcome' | 'treatment' | 'duration' | 'trigger';

interface FilterOption {
  type: FilterType;
  label: string;
  values: string[];
}

const filterOptions: FilterOption[] = [
  { type: 'outcome', label: 'Outcome Type', values: ['Full Recovery', 'Significant Improvement', 'Ongoing Management', 'Thriving'] },
  { type: 'treatment', label: 'Treatment Path', values: ['Therapy', 'Medication', 'Combined', 'Alternative'] },
  { type: 'duration', label: 'Duration', values: ['< 2 years', '2-5 years', '> 5 years'] },
  { type: 'trigger', label: 'Trigger Context', values: ['Life Event', 'Chronic Stress', 'Bereavement', 'Transition'] },
];

const getCaseAttributes = (study: typeof caseStudies[0]) => ({
  outcome: study.outcome,
  treatment: study.treatmentPath.includes('therapy') && study.treatmentPath.includes('medication') 
    ? 'Combined' 
    : study.treatmentPath.toLowerCase().includes('therapy') 
    ? 'Therapy' 
    : 'Medication',
  duration: study.duration.includes('18 months') ? '< 2 years' 
    : study.duration.includes('3') || study.duration.includes('5') ? '2-5 years' 
    : '> 5 years',
  trigger: study.trigger === 'Childbirth' || study.trigger === 'Academic pressure' ? 'Transition'
    : study.trigger === 'Bereavement' ? 'Bereavement'
    : study.trigger === 'Chronic stress' ? 'Chronic Stress'
    : 'Life Event',
});

const ComparativeView = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

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

  const handleFilterClick = (type: FilterType, value: string) => {
    if (activeFilter === type && selectedValue === value) {
      setActiveFilter(null);
      setSelectedValue(null);
    } else {
      setActiveFilter(type);
      setSelectedValue(value);
    }
  };

  const isHighlighted = (study: typeof caseStudies[0]) => {
    if (!activeFilter || !selectedValue) return true;
    const attrs = getCaseAttributes(study);
    return attrs[activeFilter] === selectedValue;
  };

  const phaseColors = {
    onset: 'bg-clay',
    treatment: 'bg-medical',
    changes: 'bg-sage',
    outcome: 'bg-primary',
  };

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

      <div className="page-container max-w-6xl mx-auto relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-display mb-6">Comparing Journeys</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            Filter and compare to see patterns and differences across experiences.
          </p>
        </motion.header>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-card mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-medium">Filter by</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {filterOptions.map((option) => (
              <div key={option.type}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{option.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleFilterClick(option.type, value)}
                      className={`filter-chip ${activeFilter === option.type && selectedValue === value ? 'active' : ''}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small Multiples */}
        <div className="grid md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: isHighlighted(study) ? 1 : 0.3, 
                y: 0,
                scale: isHighlighted(study) ? 1 : 0.98
              }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="section-card"
            >
              <h3 className="font-serif text-lg font-medium mb-4 line-clamp-1">{study.title}</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-0.5 rounded-full bg-sage-light text-sage text-xs font-medium">
                  {study.outcome}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-medical-light text-medical text-xs font-medium">
                  {study.duration}
                </span>
              </div>

              {/* Mini Timeline */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-4">
                {study.timeline.map((event, i) => (
                  <div
                    key={event.id}
                    className={`absolute h-full ${phaseColors[event.phase]}`}
                    style={{ 
                      left: `${(i / study.timeline.length) * 100}%`,
                      width: `${100 / study.timeline.length}%`
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Onset</span>
                <span>Treatment</span>
                <span>Changes</span>
                <span>Outcome</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insight Box */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-sage-light/50 border border-sage/20"
        >
          <p className="text-center text-foreground/80">
            <strong className="text-primary">Notice:</strong> Each journey follows the same phases, 
            but the duration and nature of each phase varies significantly. 
            There is no single "correct" path through depression.
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default ComparativeView;
