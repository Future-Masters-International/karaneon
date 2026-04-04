import { motion } from "framer-motion";

interface ServicePillarProps {
  title: string;
  description: string;
  items: string[];
  index: number;
  /** Dark text on light backgrounds */
  lightSurface?: boolean;
  /** Light text + shadow for full-bleed video (no white overlay) */
  videoBackdrop?: boolean;
}

const ServicePillar = ({ title, description, items, index, lightSurface, videoBackdrop }: ServicePillarProps) => {
  const onVideo = Boolean(videoBackdrop);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={
        onVideo
          ? "max-w-2xl space-y-5 md:space-y-6 rounded-xl border border-white/15 bg-black/40 p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md sm:p-5 md:p-6 ring-1 ring-white/5 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)]"
          : "max-w-3xl space-y-5 md:space-y-6"
      }
    >
      <div className="inline-block">
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.2 }}
          className={`inline-block font-display text-[10px] sm:text-xs tracking-[0.24em] sm:tracking-[0.3em] uppercase border px-3 sm:px-4 py-1.5 rounded-full ${
            onVideo
              ? "border-white/35 bg-white/10 text-white"
              : lightSurface
                ? "text-primary border-primary/40 bg-primary/5"
                : "text-primary border-primary/30"
          }`}
        >
          0{index + 1}
        </motion.span>
      </div>
      <h3
        className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
          onVideo ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]" : lightSurface ? "text-zinc-900" : "text-foreground"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-base md:text-lg leading-relaxed ${
          onVideo ? "text-white/90" : lightSurface ? "text-zinc-600" : "text-muted-foreground"
        }`}
      >
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
            className={`flex items-center gap-2 text-sm md:text-[15px] ${
              onVideo ? "text-white/90" : lightSurface ? "text-zinc-700" : "text-foreground/80"
            }`}
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
    </motion.div>
  );
};

export default ServicePillar;
