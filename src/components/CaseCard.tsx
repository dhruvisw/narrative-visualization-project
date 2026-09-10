import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Sparkles, AlertCircle } from 'lucide-react';

interface CaseCardProps {
  id: number;
  title: string;
  hook: string;
  outcome: string;
  duration: string;
  trigger: string;
  index: number;
}

const CaseCard = ({ id, title, hook, outcome, duration, trigger, index }: CaseCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/case/${id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={handleClick}
      className="case-card group"
    >
      <h3 className="font-serif text-xl font-medium mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {hook}
      </p>

      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-light text-sage text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          {outcome}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-medical-light text-medical text-xs font-medium">
          <Clock className="w-3 h-3" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay-light text-clay text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          {trigger}
        </span>
      </div>
    </motion.article>
  );
};

export default CaseCard;
