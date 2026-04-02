import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/kara.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="container">
        <div className="relative mx-auto max-w-6xl rounded-[2.25rem] border border-primary/20 bg-background/45 shadow-[0_10px_40px_hsl(155_100%_45%_/_0.1)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -left-1 top-1/2 h-[84px] w-9 -translate-y-1/2 rounded-l-[2.25rem] border-y border-l border-primary/20 bg-background/25 blur-[0.2px]" />
          <div className="pointer-events-none absolute -right-1 top-1/2 h-[84px] w-9 -translate-y-1/2 rounded-r-[2.25rem] border-y border-r border-primary/20 bg-background/25 blur-[0.2px]" />

          <div className="flex h-[84px] items-center justify-between px-5 md:px-7">

            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img src={logo} alt="Kara Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-primary/30" />
              <div className="min-w-0 leading-none">
                <p className="font-display text-xl md:text-2xl font-bold tracking-tight text-primary neon-text">KARA</p>
                <p className="hidden sm:block text-[10px] md:text-xs text-foreground/85 font-light tracking-[0.22em] uppercase truncate">
                  Business Consulting
                </p>
              </div>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-2 py-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative rounded-full px-5 py-2.5 font-display text-sm md:text-base tracking-[0.16em] uppercase transition-all duration-300 ${
                    location.pathname === link.path
                      ? "bg-primary/15 text-primary shadow-[0_0_20px_hsl(155_100%_45%_/_0.22)]"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background/40 text-foreground"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mt-3 md:hidden"
          >
            <div className="mx-auto max-w-6xl rounded-3xl border border-primary/20 bg-background/85 p-4 backdrop-blur-2xl">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-3.5 font-display text-lg tracking-[0.16em] uppercase transition-colors ${
                      location.pathname === link.path
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
