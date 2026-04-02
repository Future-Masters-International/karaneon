import ServicePillar from "./ServicePillar";
import frontImage from "@/assets/front.png";
import rightImage from "@/assets/right.png";
import backImage from "@/assets/back.png";

const pillars = [
  {
    title: "Technology",
    description: "We build the digital infrastructure that powers modern businesses — from custom software to AI-driven automation.",
    image: frontImage,
    items: [
      "Website Development",
      "AI Solutions",
      "Mobile Applications",
      "System Integrations",
      "Software Development",
      "Automations",
    ],
  },
  {
    title: "Marketing Strategy",
    description: "Strategic campaigns and content that amplify your brand across every channel and platform.",
    image: rightImage,
    items: [
      "Ad Campaigns",
      "Sponsored Ads",
      "Content Creation",
      "Video Production",
      "Event Coverage",
      "Social Media Management",
    ],
  },
  {
    title: "Execution",
    description: "From strategy to delivery — we plan, manage, and execute every initiative with precision.",
    image: backImage,
    items: [
      "Strategic Planning",
      "Project Management",
      "Business Strategy",
      "Performance Tracking",
      "Growth Consulting",
      "Process Optimization",
    ],
  },
];

const ServicesOverview = () => {
  return (
    <section className="py-20 md:py-28 lg:py-32 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(155_100%_45%_/_0.03)_0%,_transparent_50%)]" />
      <div className="container relative z-10 space-y-16 md:space-y-24 lg:space-y-32">
        <div className="text-center space-y-3 md:space-y-4">
          <p className="font-display text-[11px] sm:text-sm tracking-[0.24em] sm:tracking-[0.3em] uppercase text-primary">What We Do</p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Our Services
          </h2>
        </div>

        {pillars.map((pillar, i) => (
          <ServicePillar
            key={pillar.title}
            {...pillar}
            index={i}
            reversed={i % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesOverview;
