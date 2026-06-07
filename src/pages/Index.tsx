import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homepageBackground from "@/assets/homepage-background.jpg";
import { startSession } from "@/lib/surveyData";
import { trackExperienceStart } from "@/lib/analytics";


const Index = () => {
  const navigate = useNavigate();

  

  // Session init removed — timer starts on button click only

  // Mouse position tracking
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      <motion.div
        className="absolute inset-[-20px] pointer-events-none"
        style={{
          backgroundImage: `url(${homepageBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
          x: bgX,
          y: bgY,
          scale: bgScale,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-medical/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 max-w-4xl"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="heading-display mb-6"
        >
          MindJourneys
          <br />
          <span className="block text-2xl md:text-3xl">
            An Interactive Narrative Visualization of{' '}
            <span className="text-primary">Depression Case Reports</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="narrative-text mx-auto mb-8 text-muted-foreground"
        >
          Depression affects millions, yet each person's experience is unique. Follow these real stories to understand
          how this condition unfolds from first symptoms through treatment and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => {
              startSession();
              trackExperienceStart();
              navigate("/pre-assessment");
            }}
            className="nav-button-primary group text-lg px-10 py-4 relative overflow-hidden"
            whileHover={{ scale: 1.08, boxShadow: "0 0 40px hsl(142 25% 45% / 0.5)" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 0 0px hsl(142 25% 45% / 0), 0 0 0px hsl(142 25% 45% / 0)",
                "0 0 30px hsl(142 25% 45% / 0.45), 0 0 60px hsl(142 25% 45% / 0.2)",
                "0 0 0px hsl(142 25% 45% / 0), 0 0 0px hsl(142 25% 45% / 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Begin the Experience
            <motion.span
              className="inline-block"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default Index;
