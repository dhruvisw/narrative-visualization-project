import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import { ExternalLink, BookOpen, FileText, Play, Home, Info, Globe, FlaskConical, BarChart3, Compass } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import homepageBackground from '@/assets/homepage-background.jpg';
import { endSessionAndSubmit, getSessionStart, startPageTime, sendPageTime } from '@/lib/surveyData';
import { trackSessionEnd } from '@/lib/analytics';
import { toast } from 'sonner';

const caseSources = [
  {
    id: 1,
    title: "Rapid Response to Ketamine in Treatment Resistant Depression",
    source: "Frontiers in Psychiatry",
    citation: "Frontiers in Psychiatry, 2022. \"Rapid response to ketamine in treatment-resistant depression.\" DOI: 10.3389/fpsyt.2022.1020214",
    url: "https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.1020214/full",
  },
  {
    id: 2,
    title: "Fluctuating Recovery and the Need for Combined Treatment Approaches",
    source: "ScienceDirect (Journal Article)",
    citation: "ScienceDirect, 2024. \"Fluctuating recovery and the need for combined treatment approaches in depression.\" PII: S2773021224000245",
    url: "https://www.sciencedirect.com/science/article/pii/S2773021224000245",
  },
  {
    id: 3,
    title: "Depression Linked to Underlying Physiological Conditions",
    source: "SCIRP (Scientific Research Publishing)",
    citation: "Scientific Research Publishing (SCIRP). \"Depression linked to underlying physiological conditions.\" Paper ID: 136810",
    url: "https://www.scirp.org/journal/paperinformation?paperid=136810",
  },
];

const Bibliography = () => {
  const navigate = useNavigate();
  const submittedRef = useRef(false);

  useEffect(() => {
    startPageTime('bibliography');
    if (submittedRef.current) return;
    submittedRef.current = true;

    // Fire GA session_end with total elapsed seconds (one-time)
    const start = getSessionStart();
    if (start) {
      const totalSec = Math.floor((Date.now() - start) / 1000);
      trackSessionEnd(totalSec);
    }

    endSessionAndSubmit().then((result) => {
      if (result.alreadySubmitted) return;
      const preview = result.response?.slice(0, 200) || '(empty response)';
      if (result.ok) {
        toast.success('Assessment submitted', {
          description: `Status ${result.status} • ${preview}`,
          duration: 8000,
        });
      } else {
        toast.error('Submission failed', {
          description: `Status ${result.status} • ${preview}`,
          duration: 12000,
        });
      }
    });
  }, []);

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
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <PageWrapper showNav={false}>
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

      <div className="page-container max-w-4xl mx-auto relative z-10">
        {/* Title & Subtitle */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-display mb-6">Sources Behind the Stories</h1>
          <p className="narrative-text mx-auto text-muted-foreground">
            These real case studies informed the journeys you explored. Each reflects a different path, progression, and underlying cause of depression over time.
          </p>
        </motion.header>

        {/* Case Study Sources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="heading-section">Case Study Sources</h2>
          </div>

          <TooltipProvider delayDuration={200}>
          <div className="space-y-4">
            {caseSources.map((study, index) => (
              <motion.a
                key={study.id}
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="block section-card hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-primary mb-1 block">
                      Case {study.id}
                    </span>
                    <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                      Source: {study.source}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex cursor-help" onClick={(e) => e.preventDefault()}>
                            <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-primary transition-colors" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
                          {study.citation}
                        </TooltipContent>
                      </Tooltip>
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
          </TooltipProvider>
        </motion.section>

        {/* Research Behind the Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="heading-section">Research Behind the Stories</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            These sources provide the clinical foundation behind the journeys you explored—highlighting how depression varies across individuals, treatments, and underlying causes.
          </p>

          <div className="space-y-4">
            {[
              {
                title: "Understanding Depression",
                subtitle: "Global overview of depression, its symptoms, and impact",
                source: "World Health Organization",
                url: "https://www.who.int/news-room/fact-sheets/detail/depression",
                icon: <Globe className="w-3 h-3" />,
                tag: "Overview",
              },
              {
                title: "What is Treatment-Resistant Depression?",
                subtitle: "Clinical definition and framework for understanding why standard treatments fail",
                source: "The Journal of Clinical Psychiatry",
                url: "https://www.psychiatrist.com/wp-content/uploads/2021/02/18423_treatment-resistant-depression.pdf",
                icon: <FileText className="w-3 h-3" />,
                tag: "Clinical",
              },
              {
                title: "Ketamine and Rapid Antidepressant Effects",
                subtitle: "How ketamine works and why responses vary across patients",
                source: "National Institutes of Health (NIH)",
                url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7225830/",
                icon: <FlaskConical className="w-3 h-3" />,
                tag: "Research",
              },
            ].map((ref, index) => (
              <motion.a
                key={ref.title}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="block section-card hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-flex items-center gap-1">
                      {ref.icon}
                      {ref.tag}
                    </span>
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {ref.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{ref.subtitle}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Source: {ref.source}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* Explore Further */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Compass className="w-5 h-5 text-primary" />
            <h2 className="heading-section">Explore Further</h2>
          </div>

          <div className="space-y-4">
            <motion.a
              href="https://www.youtube.com/watch?v=R38FR2y53_w"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
              className="block section-card hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Video
                  </span>
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                    Narrative Video Experience
                  </h3>
                  <p className="text-sm text-muted-foreground">Watch the full journey of the three cases</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              </div>
            </motion.a>
            <p className="text-xs text-muted-foreground/50 mt-1 ml-1">
              Having trouble?{' '}
              <a href="https://www.youtube.com/watch?v=R38FR2y53_w" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                Open directly on YouTube
              </a>
            </p>

            <motion.a
              href="https://public.tableau.com/views/NarrativeProj_v1_3/Dashboard1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1.1 }}
              whileHover={{ scale: 1.02 }}
              className="block section-card hover:border-primary/30 transition-colors group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground mb-2 inline-flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    Dashboard
                  </span>
                  <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                    Interactive Tableau Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">Explore patterns, responses, and trajectories across cases on Tableau Public ↗</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              </div>
            </motion.a>
          </div>
        </motion.section>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="p-6 rounded-2xl bg-sage-light/30 border border-sage/20"
        >
          <h3 className="font-medium mb-2">A Note on Case Studies</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All case studies presented in this visualization are adapted from real, peer-reviewed
            clinical research. Names and identifying details have been changed to protect privacy.
            These narratives represent actual experiences documented in clinical literature and
            are intended to foster understanding of the diverse ways depression manifests and
            resolves over time.
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => {
              sendPageTime('bibliography');
              navigate('/');
            }}
            className="nav-button-primary group text-lg px-8 py-3 inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 pt-8 border-t border-border text-center"
        >
          <p className="text-muted-foreground mb-2">
            Presented by the MindJourneys team
          </p>
          <p className="text-sm text-muted-foreground">
            A narrative visualization exploring depression journeys over time.
          </p>
        </motion.footer>
      </div>
    </PageWrapper>
  );
};

export default Bibliography;
