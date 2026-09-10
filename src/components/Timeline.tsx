import { useState } from 'react';
import { motion } from 'framer-motion';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  phase: 'onset' | 'treatment' | 'changes' | 'outcome';
}

interface TimelineProps {
  events: TimelineEvent[];
}

const phaseColors = {
  onset: 'bg-clay',
  treatment: 'bg-medical',
  changes: 'bg-sage',
  outcome: 'bg-primary',
};

const phaseLabels = {
  onset: 'Onset',
  treatment: 'Treatment',
  changes: 'Changes',
  outcome: 'Outcome',
};

const Timeline = ({ events }: TimelineProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveIndex(parseInt(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Timeline Slider */}
      <div className="mb-8 px-4">
        <input
          type="range"
          min="0"
          max={events.length - 1}
          value={activeIndex}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {events.map((event, index) => (
            <span 
              key={event.id}
              className={index === activeIndex ? 'text-primary font-medium' : ''}
            >
              {phaseLabels[event.phase]}
            </span>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: index <= activeIndex ? 1 : 0.3,
              x: 0,
              scale: index === activeIndex ? 1.02 : 1
            }}
            transition={{ duration: 0.3 }}
            className={`timeline-event ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${phaseColors[event.phase]} border-4 border-background transition-all duration-300 ${index === activeIndex ? 'scale-125' : ''}`} />
            <div className={`p-4 rounded-xl transition-all duration-300 ${index === activeIndex ? 'bg-card shadow-sm' : ''}`}>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${phaseColors[event.phase]} text-white`}>
                {phaseLabels[event.phase]}
              </span>
              <h4 className="font-serif text-lg font-medium mb-2">{event.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
