import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import {
  postAssessmentQuestions,
  LIKERT_LABELS,
  type AssessmentQuestion,
} from '@/data/assessmentQuestions';
import { ArrowRight } from 'lucide-react';
import { getSessionId, startPageTime, sendPageTime, submitAssessmentNow } from '@/lib/surveyData';
import { trackAssessmentSubmit, startPageTimer, endPageTimer } from '@/lib/analytics';


const isAnswered = (q: AssessmentQuestion, value: string | number | undefined) => {
  if (value === undefined || value === null) return false;
  if (q.type === 'short-answer') {
    const min = q.minLength ?? 1;
    return typeof value === 'string' && value.trim().length >= min;
  }
  return true;
};

const PostAssessment = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, string | number>>({});

  const allAnswered = postAssessmentQuestions.every((q) => isAnswered(q, responses[q.id]));

  useEffect(() => {
    startPageTimer('assessment_page');
    startPageTime('post-assessment');
    return () => endPageTimer('assessment_page');
  }, []);

  const setAnswer = (id: string, value: string | number) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const data = {
      session_id: getSessionId(),
      timestamp: Date.now(),
      responses,
    };
    localStorage.setItem('post_assessment_responses', JSON.stringify(data));

    trackAssessmentSubmit('post');
    endPageTimer('assessment_page');

    // Fire POST to Apps Script immediately on submit click
    submitAssessmentNow('post', responses);

    sendPageTime('post-assessment');

    // Survey data is also submitted on bibliography page (final page)
    navigate('/learned');
  };

  const renderQuestion = (question: AssessmentQuestion, index: number) => {
    const header = (
      <p className="font-medium text-foreground mb-4 text-sm md:text-base">
        {index + 1}. {question.text}
      </p>
    );

    if (question.type === 'likert') {
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          className="section-card"
        >
          {header}
          <div className="flex flex-wrap gap-2">
            {LIKERT_LABELS.map((label, value) => (
              <button
                key={value}
                onClick={() => setAnswer(question.id, value + 1)}
                className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 border ${
                  responses[question.id] === value + 1
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    if (question.type === 'multiple-choice') {
      return (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          className="section-card"
        >
          {header}
          <div className="grid gap-2">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => setAnswer(question.id, option)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  responses[question.id] === option
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      );
    }

    // short-answer
    const currentValue = (responses[question.id] as string) || '';
    const minLen = question.minLength ?? 0;
    const trimmedLen = currentValue.trim().length;
    const meetsMin = trimmedLen >= minLen;
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="section-card"
      >
        {header}
        {question.helpText && (
          <p className="text-xs text-muted-foreground mb-2">{question.helpText}</p>
        )}
        <textarea
          value={currentValue}
          onChange={(e) => {
            const next = question.maxLength
              ? e.target.value.slice(0, question.maxLength)
              : e.target.value;
            setAnswer(question.id, next);
          }}
          rows={3}
          maxLength={question.maxLength}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
          placeholder="Share your thoughts..."
        />
        {minLen > 0 && (
          <p className={`mt-1 text-xs text-right ${meetsMin ? 'text-muted-foreground' : 'text-destructive'}`}>
            {trimmedLen}/{minLen} characters minimum
          </p>
        )}
      </motion.div>
    );
  };

  return (
    <PageWrapper showNav={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="heading-display text-3xl md:text-4xl mb-3">One Final Reflection</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              You've explored four journeys through depression. Share your thoughts now.
            </p>
          </div>

          <div className="space-y-6">
            {postAssessmentQuestions.map((question, index) => renderQuestion(question, index))}
          </div>

          <AnimatePresence>
            {allAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-10 text-center"
              >
                <button
                  onClick={handleSubmit}
                  className="nav-button-primary group text-lg px-8 py-3"
                >
                  Submit & Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!allAnswered && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please answer all questions to submit.
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PostAssessment;
