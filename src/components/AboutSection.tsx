import { motion } from "framer-motion";
import { Cpu, Target, Zap } from "lucide-react";

const values = [
  { icon: Cpu, title: "Innovation", desc: "Leveraging the latest in AI and technology to stay ahead of the curve." },
  { icon: Target, title: "Precision", desc: "Data-driven strategies that hit the mark every single time." },
  { icon: Zap, title: "Speed", desc: "Rapid execution without sacrificing quality or attention to detail." },
];

const AboutSection = () => {
  return (
    <section className="py-32 relative grid-bg">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="font-display text-sm tracking-[0.3em] uppercase text-primary">About Us</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Where Technology
              <br />
              Meets <span className="text-primary neon-text">Ambition</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Kara Business Consulting is a full-service business development firm that merges technology, marketing, and execution into one seamless engine. We don't just advise — we build, launch, and scale.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From AI-powered software solutions to viral marketing campaigns, we provide end-to-end services that transform businesses. Our team of experts works hand-in-hand with you to deliver measurable, impactful results.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-5 p-6 rounded-xl border border-border bg-card hover:neon-border transition-shadow duration-500"
              >
                <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">{v.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
