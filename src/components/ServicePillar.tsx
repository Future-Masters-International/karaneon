import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface ServicePillarProps {
  title: string;
  description: string;
  image: string;
  items: string[];
  index: number;
  reversed?: boolean;
}

const ServicePillar = ({ title, description, image, items, index, reversed }: ServicePillarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center`}
    >
      <div className={`space-y-5 md:space-y-6 ${reversed ? "lg:order-2" : ""}`}>
        <div className="inline-block">
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block font-display text-[10px] sm:text-xs tracking-[0.24em] sm:tracking-[0.3em] uppercase text-primary border border-primary/30 px-3 sm:px-4 py-1.5 rounded-full"
          >
            0{index + 1}
          </motion.span>
        </div>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
          {description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-2 text-sm md:text-[15px] text-foreground/80"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className={`relative ${reversed ? "lg:order-1" : ""}`}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 800 }}
      >
        <motion.div
          className="relative group"
          style={{ rotateX, rotateY }}
        >
          {/* Glow behind card */}
          <motion.div
            className="absolute -inset-2 rounded-2xl bg-primary/10 blur-2xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
            />

            <img src={image} alt={`${title} service visual`} className="w-full aspect-[4/3] sm:aspect-square object-cover opacity-95" />

            {/* Corner accents */}
            <div className="absolute top-3 left-3 z-30 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl-md" />
            <div className="absolute top-3 right-3 z-30 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr-md" />
            <div className="absolute bottom-3 left-3 z-30 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl-md" />
            <div className="absolute bottom-3 right-3 z-30 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br-md" />
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/60"
            style={{
              top: `${20 + i * 20}%`,
              left: i % 2 === 0 ? "-5%" : "105%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ServicePillar;
