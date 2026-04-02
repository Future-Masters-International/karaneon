import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            <span className="text-primary neon-text">KARA</span>
            <span className="text-foreground ml-2 text-xs font-light tracking-widest uppercase">Business Consulting</span>
          </Link>
          <div className="flex items-center gap-8">
            {["Home", "About Us", "Services", "Contact"].map((label) => (
              <Link
                key={label}
                to={label === "Home" ? "/" : `/${label.toLowerCase().replace(" ", "-").replace("about-us", "about")}`}
                className="text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 Kara Business Consulting
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
