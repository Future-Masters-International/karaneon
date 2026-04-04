import ServicePillar from "./ServicePillar";
import servicesHeroBg from "@/assets/services.jpg";
import techVideo from "@/assets/video1.mp4";
import marketingVideo from "@/assets/video2.mp4";
import executionVideo from "@/assets/video3.mp4";

/** Each pillar: full-bleed background video; no white wash — text uses light-on-video styling in ServicePillar. */
const pillars = [
  {
    title: "Technology",
    description: "We build the digital infrastructure that powers modern businesses — from custom software to AI-driven automation.",
    videoUrl: techVideo,
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
    videoUrl: marketingVideo,
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
    videoUrl: executionVideo,
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
    <div className="relative">
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
        <img
          src={servicesHeroBg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-black/55"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
          aria-hidden
        />
        <div className="container relative z-10 text-center space-y-3 md:space-y-4">
          <p className="font-display text-[11px] sm:text-sm tracking-[0.24em] sm:tracking-[0.3em] uppercase text-primary drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            What We Do
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            Our Services
          </h2>
        </div>
      </section>

      {pillars.map((pillar, i) => {
        const { videoUrl, ...pillarProps } = pillar;
        return (
          <section
            key={pillar.title}
            className="relative overflow-hidden bg-black py-16 md:py-20 lg:py-24"
          >
            <video
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              aria-hidden
            />
            {/* Scrim: darkens where copy sits so type stays legible on any footage */}
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/45 to-black/15"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/55 via-transparent to-black/25"
              aria-hidden
            />
            <div className="container relative z-10">
              <ServicePillar {...pillarProps} index={i} videoBackdrop />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ServicesOverview;
