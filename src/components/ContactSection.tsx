import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(110_100%_55%_/_0.04)_0%,_transparent_60%)]" />
      <div className="container relative z-10">
        <div className="text-center space-y-4 mb-16">
          <p className="font-display text-sm tracking-[0.3em] uppercase text-primary">Get in Touch</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Contact Us
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ready to transform your business? Let's talk about how we can help you grow with technology, marketing, and strategic execution.
            </p>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "info@karaconsulting.com" },
                { icon: Phone, label: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Global — Remote First" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center p-12 rounded-2xl border border-primary/30 neon-border">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[var(--neon-glow)] transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[var(--neon-glow)] transition-all"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[var(--neon-glow)] transition-all"
                />
                <textarea
                  placeholder="Your message..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[var(--neon-glow)] transition-all resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-display font-semibold py-4 rounded-lg text-sm uppercase tracking-wider hover:shadow-[var(--neon-glow-strong)] transition-shadow duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
