import { useEffect, useMemo, useState } from "react";
import RobotBackSalesImprovement from "./RobotBackSalesImprovement";

const RobotBackGeneratedVideoOverlay = ({
  className,
  target = "sales",
}: {
  className?: string;
  target?: "sales" | "marketing";
}) => {
  // We load from `public/` (served at /...) so the build doesn't fail if the file isn't present yet.
  const candidates = useMemo(
    () =>
      target === "marketing"
        ? ["/robot-back-marketing-animation.webm", "/robot-back-marketing-animation.mp4"]
        : ["/robot-back-sales-animation.webm", "/robot-back-sales-animation.mp4"],
    [target],
  );
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      for (const c of candidates) {
        try {
          const res = await fetch(c, { method: "HEAD" });
          if (res.ok && !cancelled) {
            setSrc(c);
            return;
          }
        } catch {
          // Ignore and try next candidate
        }
      }

      if (!cancelled) setSrc(null);
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [candidates]);

  if (!src) {
    // Fallback: show animated overlay (cursor/laser/rings) without drawing its own base image.
    return <RobotBackSalesImprovement frame={false} showBaseImage={false} className={className} target={target} />;
  }

  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={`absolute inset-0 z-20 w-full h-full object-cover ${className ?? ""}`}
      aria-hidden="true"
    />
  );
};

export default RobotBackGeneratedVideoOverlay;

