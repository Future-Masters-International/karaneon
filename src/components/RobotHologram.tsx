import {
  MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import robotImage from "@/assets/robot-holo.png";

type RobotHologramVariant = "hero" | "service";

interface RobotHologramProps {
  variant: RobotHologramVariant;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  className?: string;
}

const RobotHologram = ({ variant, x, y, className }: RobotHologramProps) => {
  const reduceMotion = useReducedMotion();
  const dummyX = useMotionValue(0);
  const dummyY = useMotionValue(0);

  const px = x ?? dummyX;
  const py = y ?? dummyY;

  const driftX = useSpring(
    useTransform(px, [-150, 150], [variant === "hero" ? -12 : -8, variant === "hero" ? 12 : 8]),
    { stiffness: 260, damping: 24 },
  );
  const driftY = useSpring(
    useTransform(py, [-150, 150], [variant === "hero" ? -10 : -6, variant === "hero" ? 10 : 6]),
    { stiffness: 260, damping: 24 },
  );

  const rotateX = useSpring(useTransform(py, [-150, 150], [variant === "hero" ? 8 : 0, variant === "hero" ? -8 : 0]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(px, [-150, 150], [variant === "hero" ? -8 : 0, variant === "hero" ? 8 : 0]), {
    stiffness: 260,
    damping: 24,
  });

  if (reduceMotion) {
    return (
      <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden="true">
        <img src={robotImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
      </div>
    );
  }

  const glitchClipA = ["inset(0% 0% 62% 0%)", "inset(36% 0% 28% 0%)", "inset(0% 0% 62% 0%)"];
  const glitchClipB = ["inset(58% 0% 0% 0%)", "inset(22% 0% 62% 0%)", "inset(58% 0% 0% 0%)"];

  const particles =
    variant === "hero"
      ? [
          { top: "16%", left: "8%" },
          { top: "28%", left: "90%" },
          { top: "44%", left: "18%" },
          { top: "52%", left: "84%" },
          { top: "66%", left: "10%" },
          { top: "70%", left: "92%" },
        ]
      : [];

  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""} z-20`} aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(155_100%_45%/_0.24),transparent_55%)] blur-2xl"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          rotateX,
          rotateY,
          x: driftX,
          y: driftY,
        }}
      >
        {/* Base layer */}
        <motion.img
          src={robotImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(1.25) contrast(1.1)" }}
          animate={{ opacity: [0.75, 0.95, 0.75] }}
          transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cyan glitch layer */}
        <motion.img
          src={robotImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            mixBlendMode: "screen",
            opacity: 0.6,
            filter: "saturate(1.45) hue-rotate(12deg)",
          }}
          animate={{
            clipPath: glitchClipA,
            opacity: [0.18, 0.65, 0.18],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Magenta glitch layer */}
        <motion.img
          src={robotImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            mixBlendMode: "screen",
            opacity: 0.42,
            filter: "saturate(1.5) hue-rotate(-18deg)",
          }}
          animate={{
            clipPath: glitchClipB,
            opacity: [0.1, 0.55, 0.1],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Moving scan line */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-[2px] bg-primary/70 blur-sm"
        animate={{ y: ["-30%", "120%"] }}
        transition={{ duration: 2.25, repeat: Infinity, ease: "linear" }}
      />

      {/* Texture scanlines */}
      <motion.div
        className="absolute inset-0 scanline opacity-20 mix-blend-screen"
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {particles.map((p, i) => (
        <motion.span
          key={`${p.top}-${p.left}-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/60"
          style={{ top: p.top, left: p.left }}
          animate={{ y: [0, variant === "hero" ? -18 : -10, 0], opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 2.4 + i * 0.25, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

export default RobotHologram;

