import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import {
  preAssessmentQuestions,
  LIKERT_LABELS,
  type AssessmentQuestion,
} from '@/data/assessmentQuestions';
import { ArrowRight } from 'lucide-react';
import { getSessionId, startPageTime, sendPageTime, submitAssessmentNow } from '@/lib/surveyData';
import { trackAssessmentSubmit } from '@/lib/analytics';


const isAnswered = (q: AssessmentQuestion, value: string | number | undefined) => {
  if (value === undefined || value === null) return false;
  if (q.type === 'short-answer') {
    const min = q.minLength ?? 1;
    return typeof value === 'string' && value.trim().length >= min;
  }
  if (q.type === 'multiple-choice' && q.allowOther && typeof value === 'string' && value.startsWith('Other:')) {
    return value.slice(6).trim().length > 0;
  }
  return true;
};

const PreAssessment = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Record<string, string | number>>({});

  const allAnswered = preAssessmentQuestions.every((q) => isAnswered(q, responses[q.id]));

  useEffect(() => {
    startPageTime('pre-assessment');
  }, []);

  const setAnswer = (id: string, value: string | number) => {
    setResponses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const data = {
      session_id: getSessionId(),
      timestamp: Date.now(),
      responses,
    };
    localStorage.setItem('pre_assessment_responses', JSON.stringify(data));

    const rawGender = responses['pre_gender'] as string | undefined;
    const gender = rawGender
      ? rawGender.startsWith('Other:') ? rawGender.slice(6).trim() || 'Other' : rawGender
      : undefined;
    trackAssessmentSubmit('pre', gender);

    // Fire POST to Apps Script immediately on submit click
    submitAssessmentNow('pre', responses);

    sendPageTime('pre-assessment');
    navigate('/about-depression');
  };

  const renderQuestion = (question: AssessmentQuestion, index: number) => {
    const baseHeader = (
      <p className="font-medium text-foreground mb-4 text-sm md:text-base">
        {index + 1}. {question.text}
      </p>
    );

    if (question.type === 'likert') {
      return (
        <>
          {baseHeader}
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
        </>
      );
    }

    if (question.type === 'multiple-choice') {
      const currentValue = responses[question.id];
      const isOtherSelected =
        question.allowOther &&
        typeof currentValue === 'string' &&
        currentValue.startsWith('Other:');
      const otherText = isOtherSelected ? (currentValue as string).slice(6) : '';

      return (
        <>
          {baseHeader}
          <div className="grid gap-2">
            {question.options.map((option) => {
              const isOther = question.allowOther && option === 'Other';
              const isSelected = isOther
                ? isOtherSelected
                : currentValue === option;
              return (
                <button
                  key={option}
                  onClick={() => setAnswer(question.id, isOther ? 'Other:' : option)}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {option}
                </button>
              );
            })}
            {isOtherSelected && (
              <input
                type="text"
                value={otherText}
                onChange={(e) => setAnswer(question.id, `Other:${e.target.value}`)}
                placeholder="Please specify..."
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
              />
            )}
          </div>
        </>
      );
    }

    // short-answer
    const currentValue = (responses[question.id] as string) || '';
    const minLen = question.minLength ?? 0;
    const trimmedLen = currentValue.trim().length;
    const meetsMin = trimmedLen >= minLen;
    return (
      <>
        {baseHeader}
        {question.helpText && (
          <p className="text-xs text-muted-foreground mb-2">{question.helpText}</p>
        )}
        <textarea
          value={currentValue}
          onChange={(e) => setAnswer(question.id, e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
          placeholder="Share your thoughts..."
        />
        {minLen > 0 && (
          <p className={`mt-1 text-xs text-right ${meetsMin ? 'text-muted-foreground' : 'text-destructive'}`}>
            {trimmedLen}/{minLen} characters minimum
          </p>
        )}
      </>
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
            <h1 className="heading-display text-3xl md:text-4xl mb-3">Before We Begin</h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              Before you begin, we'd like to understand how you currently think about depression. There are no right or wrong answers—just your perspective.
            </p>
          </div>

          <div className="space-y-6">
            {preAssessmentQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="section-card"
              >
                {renderQuestion(question, index)}
              </motion.div>
            ))}
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
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!allAnswered && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please answer all questions to continue.
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default PreAssessment;
