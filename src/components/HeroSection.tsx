import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/og.mp4";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Full-bleed hero video background */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Contrast overlays so text stays readable */}
      <div className="absolute inset-0 bg-background/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(155_100%_45%_/_0.16)_0%,_transparent_65%)]" />
      <div className="absolute inset-0 grid-bg scanline opacity-50" />

      <div className="container relative z-10 pt-28 md:pt-32 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 max-w-3xl"
        >
          <div className="space-y-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display text-[11px] sm:text-sm tracking-[0.24em] sm:tracking-[0.3em] uppercase text-primary"
            >
              Technology · Marketing · Execution
            </motion.p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              <span className="text-foreground">Kara</span>
              <br />
              <span className="text-primary neon-text">Consulting</span>
              <br />
              <span className="text-lg sm:text-xl md:text-2xl tracking-wide text-foreground">Transforming Vision Into Value.</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
            Premier Business Development across the GCC.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg text-sm uppercase tracking-wider hover:shadow-[var(--neon-glow-strong)] transition-shadow duration-300 w-full sm:w-auto"
            >
              Our Services <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-primary/30 text-primary font-display font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg text-sm uppercase tracking-wider hover:border-primary/60 hover:shadow-[var(--neon-glow)] transition-all duration-300 w-full sm:w-auto"
            >
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
