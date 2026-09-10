import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseStudies } from '@/data/caseStudies';

interface GhostJourney {
  id: string;
  label: string;
  description: string;
  color: string;
  path: number[]; // Y positions (0-100) at each phase
}

interface PhaseVignette {
  journeyId: string;
  text: string;
}

interface Phase {
  id: string;
  title: string;
  vignettes: PhaseVignette[];
}

const ghostJourneys: GhostJourney[] = [
  {
    id: 'A',
    label: 'Journey A',
    description: 'Gradual decline, slow recognition, steady recovery',
    color: 'hsl(var(--sage))',
    path: [35, 55, 65, 45, 30],
  },
  {
    id: 'B',
    label: 'Journey B',
    description: 'Sudden collapse, delayed help, long uncertainty',
    color: 'hsl(var(--medical-blue))',
    path: [20, 85, 75, 60, 50],
  },
  {
    id: 'C',
    label: 'Journey C',
    description: 'Cyclical relapse, early recognition, inconsistent treatment',
    color: 'hsl(var(--clay))',
    path: [50, 40, 70, 45, 55],
  },
  {
    id: 'D',
    label: 'Journey D',
    description: 'Hidden struggle, external push, partial relief',
    color: 'hsl(var(--primary))',
    path: [45, 50, 55, 40, 35],
  },
];

const phases: Phase[] = [
  {
    id: 'onset',
    title: 'Onset',
    vignettes: [
      { journeyId: 'A', text: "I didn't notice anything was wrong — until nothing felt right." },
      { journeyId: 'B', text: "Everything fell apart in a single month." },
      { journeyId: 'C', text: "I kept functioning, but inside I was fading." },
      { journeyId: 'D', text: "It came and went. I thought it was just stress." },
    ],
  },
  {
    id: 'recognition',
    title: 'Recognition',
    vignettes: [
      { journeyId: 'A', text: "It took months before I admitted this wasn't normal sadness." },
      { journeyId: 'B', text: "Someone else saw it before I could name it." },
      { journeyId: 'C', text: "I knew something was wrong, but I kept hoping it would pass." },
      { journeyId: 'D', text: "My partner finally said what I couldn't say to myself." },
    ],
  },
  {
    id: 'treatment',
    title: 'Treatment',
    vignettes: [
      { journeyId: 'A', text: "Finding the right help took time, but each step forward counted." },
      { journeyId: 'B', text: "I tried so many things. Some helped. Most didn't." },
      { journeyId: 'C', text: "Treatment worked, then stopped, then worked again differently." },
      { journeyId: 'D', text: "I resisted help at first. When I finally accepted it, things shifted." },
    ],
  },
  {
    id: 'living',
    title: 'Living With',
    vignettes: [
      { journeyId: 'A', text: "I found my way back. It's different now, but it's mine." },
      { journeyId: 'B', text: "Some days are still hard. But I have tools now." },
      { journeyId: 'C', text: "I've learned to live with the uncertainty. It's part of me." },
      { journeyId: 'D', text: "I'm not who I was before. Maybe that's okay." },
    ],
  },
];

const GhostJourneyMap = () => {
  const navigate = useNavigate();
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [highlightedJourney, setHighlightedJourney] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const generateSmoothPath = (journey: GhostJourney, width: number, height: number) => {
    const points = journey.path;
    const segmentWidth = width / (points.length - 1);
    
    let path = `M 0 ${(points[0] / 100) * height}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const x1 = i * segmentWidth;
      const y1 = (points[i] / 100) * height;
      const x2 = (i + 1) * segmentWidth;
      const y2 = (points[i + 1] / 100) * height;
      
      const cpx1 = x1 + segmentWidth * 0.4;
      const cpy1 = y1;
      const cpx2 = x2 - segmentWidth * 0.4;
      const cpy2 = y2;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`;
    }
    
    return path;
  };

  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhase(selectedPhase === phaseId ? null : phaseId);
  };

  const handleTransitionToStories = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/cases');
    }, 1200);
  };

  const selectedPhaseData = phases.find(p => p.id === selectedPhase);

  return (
    <div className="w-full">
      {/* Journey Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {ghostJourneys.map((journey) => (
          <motion.button
            key={journey.id}
            onMouseEnter={() => setHighlightedJourney(journey.id)}
            onMouseLeave={() => setHighlightedJourney(null)}
            onClick={() => setHighlightedJourney(highlightedJourney === journey.id ? null : journey.id)}
            className={`group relative px-4 py-2 rounded-full transition-all duration-300 ${
              highlightedJourney === journey.id 
                ? 'bg-card shadow-md' 
                : 'bg-transparent hover:bg-card/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: journey.color }}
              />
              <span className="text-sm font-medium text-foreground">{journey.label}</span>
            </div>
            
            {/* Tooltip */}
            <AnimatePresence>
              {highlightedJourney === journey.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 bg-card rounded-lg shadow-lg z-20 whitespace-nowrap"
                >
                  <p className="text-xs text-muted-foreground italic">{journey.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* The River Map */}
      <div className="relative bg-card/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        {/* Phase Labels */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {phases.map((phase) => (
            <motion.button
              key={phase.id}
              onClick={() => handlePhaseClick(phase.id)}
              onMouseEnter={() => setHoveredPhase(phase.id)}
              onMouseLeave={() => setHoveredPhase(null)}
              className={`text-center py-3 px-2 rounded-xl transition-all duration-300 ${
                selectedPhase === phase.id 
                  ? 'bg-primary/20 text-primary' 
                  : hoveredPhase === phase.id 
                    ? 'bg-card/80 text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-serif text-sm md:text-base font-medium">{phase.title}</span>
            </motion.button>
          ))}
        </div>

        {/* SVG River */}
        <div className="relative h-48 md:h-64">
          <svg
            ref={svgRef}
            viewBox="0 0 800 200"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Phase dividers */}
            {[1, 2, 3].map((i) => (
              <line
                key={i}
                x1={i * 200}
                y1="0"
                x2={i * 200}
                y2="200"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
            ))}

            {/* Ghost journey paths */}
            {ghostJourneys.map((journey, index) => {
              const isHighlighted = highlightedJourney === journey.id;
              const isDimmed = highlightedJourney && highlightedJourney !== journey.id;
              
              return (
                <motion.path
                  key={journey.id}
                  d={generateSmoothPath(journey, 800, 200)}
                  fill="none"
                  stroke={journey.color}
                  strokeWidth={isHighlighted ? 4 : 2.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isTransitioning ? 0 : 1, 
                    opacity: isTransitioning ? 0 : isDimmed ? 0.2 : 0.6,
                    strokeWidth: isHighlighted ? 4 : 2.5,
                  }}
                  transition={{ 
                    pathLength: { duration: 2, delay: index * 0.3 },
                    opacity: { duration: isTransitioning ? 0.8 : 0.3 },
                    strokeWidth: { duration: 0.2 }
                  }}
                  style={{
                    filter: isHighlighted ? `drop-shadow(0 0 8px ${journey.color})` : 'none',
                  }}
                />
              );
            })}

            {/* Breathing animation overlay */}
            {ghostJourneys.map((journey, index) => (
              <motion.path
                key={`glow-${journey.id}`}
                d={generateSmoothPath(journey, 800, 200)}
                fill="none"
                stroke={journey.color}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.15"
                animate={{
                  opacity: [0.1, 0.25, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut",
                }}
                style={{
                  filter: `blur(4px)`,
                }}
              />
            ))}
          </svg>

          {/* Hover overlay for phases */}
          <AnimatePresence>
            {hoveredPhase && !selectedPhase && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg"
              >
                <p className="text-sm text-muted-foreground text-center">
                  Here is how this phase felt for four different people.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Axis labels */}
        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
          <span>← Beginning</span>
          <span className="italic">emotional intensity varies</span>
          <span>Present →</span>
        </div>

        {/* Expanded Phase View */}
        <AnimatePresence>
          {selectedPhaseData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-serif text-xl text-center mb-6 text-foreground">
                  {selectedPhaseData.title}
                  <span className="block text-sm font-sans text-muted-foreground mt-1">
                    Four perspectives on the same phase
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPhaseData.vignettes.map((vignette, index) => {
                    const journey = ghostJourneys.find(j => j.id === vignette.journeyId);
                    return (
                      <motion.div
                        key={vignette.journeyId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-background/50"
                        onMouseEnter={() => setHighlightedJourney(vignette.journeyId)}
                        onMouseLeave={() => setHighlightedJourney(null)}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: journey?.color }}
                        />
                        <p className="text-sm text-foreground/90 italic leading-relaxed">
                          "{vignette.text}"
                        </p>
                      </motion.div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setSelectedPhase(null)}
                  className="mt-4 mx-auto block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center text-sm text-muted-foreground mt-6 italic"
      >
        These paths are not universal. They preview the diversity you will see in the real stories.
      </motion.p>

      {/* Transition to Case Studies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="mt-12 text-center"
      >
        <motion.button
          onClick={handleTransitionToStories}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isTransitioning}
        >
          <span>Continue to Real Journeys</span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>

        {/* Transitioning portraits preview */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex justify-center gap-4"
            >
              {caseStudies.slice(0, 4).map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-card shadow-lg"
                >
                  <img 
                    src={study.image} 
                    alt={study.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GhostJourneyMap;
