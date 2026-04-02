import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import robotBackImg from "@/assets/robot-back-sales.png";

/**
 * Robot-from-back selection animation for the "Sales Improvement" icon.
 * Implemented as an in-app "video-like" effect (no exported MP4).
 */
interface RobotBackSalesImprovementProps {
  /**
   * When false, renders as an absolute overlay (no border/card frame).
   * Useful when embedding inside another rounded container.
   */
  frame?: boolean;
  className?: string;
  /**
   * Controls whether the component renders its own robot background image.
   * When embedding in the Technology pillar we usually set this to false
   * so the underlying <video> remains visible.
   */
  showBaseImage?: boolean;
  target?: "sales" | "marketing";
}

const RobotBackSalesImprovement = ({
  frame = true,
  className,
  showBaseImage,
  target = "sales",
}: RobotBackSalesImprovementProps) => {
  const reduceMotion = useReducedMotion();
  const renderBaseImage = showBaseImage ?? frame;

  // Coordinates are expressed as percentages in a 100x100 overlay space.
  // Tuned for the provided 1024x768 source.
  const start = useMemo(() => ({ x: 48.8, y: 84.5 }), []);
  const icon = useMemo(
    () => (target === "marketing" ? { x: 77.8, y: 25.8 } : { x: 21.5, y: 30.6 }),
    [target],
  );

  const sparks = useMemo(() => {
    const arr: Array<{ a: number; d: number; s: number }> = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const d = 10 + i * 2.4;
      const s = 7 + (i % 3) * 3;
      arr.push({ a, d, s });
    }
    return arr;
  }, []);

  if (reduceMotion) {
    if (!renderBaseImage) return null;
    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${frame ? "border border-border bg-card" : "absolute inset-0 bg-transparent"} ${
          className ?? ""
        }`}
        aria-hidden="true"
      >
        <img src={robotBackImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
      </div>
    );
  }

  const duration = 4.2;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${frame ? "border border-border bg-card" : "absolute inset-0 bg-transparent"} ${
        className ?? ""
      }`}
    >
      {renderBaseImage && (
        // Background image: only render when frame=true (standalone card).
        // In Technology pillar (frame=false) we keep it off so the video stays visible.
        <motion.img
          src={robotBackImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-95"
          initial={{ scale: 1.01, x: 0, y: 0 }}
          animate={{
            scale: [1.01, 1.05, 1.01],
            x: [0, -18, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Neon scanline overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(72,255,160,0.04) 2px, rgba(72,255,160,0.04) 4px)",
        }}
        animate={{ opacity: [0.18, 0.33, 0.18], y: [0, -8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Laser beam (SVG line in overlay coordinate space) */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgba(72,255,160,0.0)" />
            <stop offset="0.35" stopColor="rgba(72,255,160,0.85)" />
            <stop offset="1" stopColor="rgba(35,255,255,0.0)" />
          </linearGradient>
        </defs>

        <motion.line
          x1={start.x}
          y1={start.y}
          x2={icon.x}
          y2={icon.y}
          stroke="url(#beam)"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.9, 0.1, 0],
            pathLength: [0.2, 1, 1, 0.2],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.line
          x1={start.x}
          y1={start.y}
          x2={icon.x}
          y2={icon.y}
          stroke="rgba(35,255,255,0.55)"
          strokeWidth="4.4"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0.1, 0], pathLength: [0.2, 1, 1, 0.2] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Icon selection rings */}
      <div className="absolute inset-0">
        <div
          className="absolute"
          style={{ left: `${icon.x}%`, top: `${icon.y}%`, transform: "translate(-50%, -50%)" }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 rounded-full border border-primary/60"
            style={{ width: 10, height: 10 }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 0], scale: [0.75, 1.25, 0.9] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute rounded-full"
            style={{
              width: 34,
              height: 34,
              border: "2px solid rgba(72,255,160,0.35)",
              boxShadow: "0 0 18px rgba(72,255,160,0.35)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 0], scale: [0.95, 1.22, 0.98] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Sparks */}
          {sparks.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-primary/70"
              style={{
                width: 6,
                height: 6,
                left: 0,
                top: 0,
                transform: `translate(calc(50% - 3px), calc(50% - 3px)) rotate(${(p.a * 180) / Math.PI}deg) translateX(${p.d}px)`,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0, 0.95, 0],
                scale: [0.7, 1.15, 0.75],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay: i * 0.04,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Moving cursor */}
      <motion.div
        aria-hidden="true"
        className="absolute z-20"
        initial={{ left: `${start.x}%`, top: `${start.y}%`, opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0],
          left: [`${start.x}%`, `${icon.x}%`, `${icon.x}%`, `${start.x}%`],
          top: [`${start.y}%`, `${icon.y}%`, `${icon.y}%`, `${start.y}%`],
          scale: [0.8, 1.0, 1.18, 0.9],
        }}
        transition={{ duration, repeat: Infinity, times: [0, 0.25, 0.72, 1], ease: "easeInOut" }}
      >
        <div className="relative" style={{ width: 22, height: 22 }}>
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-[0.6px]" />
          <div className="absolute inset-0 rounded-full bg-primary/70 shadow-[0_0_16px_hsl(155_100%_45%/_0.65)]" />
          <div className="absolute inset-0 rounded-full border border-primary/60" style={{ opacity: 0.9 }} />
        </div>
      </motion.div>
    </div>
  );
};

export default RobotBackSalesImprovement;

