import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import robotBackImg from "@/assets/robot-back-sales.png";
import { useEffect, useMemo, useRef, useState } from "react";

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

const ExportRobotVideo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"idle" | "recording" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // 100x100 "overlay" coords from the React animation.
  const start = useMemo(() => ({ x: 48.8, y: 84.5 }), []);
  const icon = useMemo(() => ({ x: 21.5, y: 30.6 }), []);

  useEffect(() => {
    // Draw a first frame so the user sees something immediately.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const img = new Image();
    img.src = robotBackImg;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const ix = (icon.x / 100) * canvas.width;
      const iy = (icon.y / 100) * canvas.height;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = "rgba(72,255,160,0.35)";
      ctx.beginPath();
      ctx.arc(ix, iy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
  }, [icon.x, icon.y]);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const record = async () => {
    setStatus("recording");
    setError(null);

    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Canvas not found");
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) throw new Error("2D context not found");

      const fps = 30;
      const durationMs = 4200;

      const supportedTypes = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      const mimeType = supportedTypes.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";

      const stream = canvas.captureStream(fps);
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const img = new Image();
      img.src = robotBackImg;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      // Helper draws.
      const drawGlowCircle = (x: number, y: number, r: number, color: string, alpha: number) => {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = alpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = r * 2.8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawRing = (
        x: number,
        y: number,
        r: number,
        color: string,
        alpha: number,
        thickness: number,
      ) => {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = thickness * 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      const w = canvas.width;
      const h = canvas.height;
      const ix = (icon.x / 100) * w;
      const iy = (icon.y / 100) * h;
      const sx = (start.x / 100) * w;
      const sy = (start.y / 100) * h;

      const drawLaser = (ax: number, ay: number, bx: number, by: number, alpha: number) => {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 10;
        ctx.strokeStyle = "rgba(35,255,255,0.35)";
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(80,255,170,0.9)";
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.restore();
      };

      recorder.start();

      const startAt = performance.now();
      let raf = 0;
      const renderFrame = () => {
        const now = performance.now();
        const t = now - startAt;
        const tSec = t / 1000;
        const done = t >= durationMs;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Camera motion (subtle zoom + pan toward the icon).
        const selectStart = 0.7;
        const selectEnd = 1.8;
        const selectT = clamp01((tSec - selectStart) / (selectEnd - selectStart));
        const selectE = easeInOutCubic(selectT);

        const zoom = 1 + 0.04 * easeOutSine(selectE);
        const panX = lerp(0, -0.22 * w, selectE);
        const panY = lerp(0, -0.18 * h, selectE);

        ctx.save();
        ctx.translate(w / 2 + panX, h / 2 + panY);
        ctx.scale(zoom, zoom);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();

        // Scanlines
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const lineAlpha = 0.06 + 0.08 * (0.5 + 0.5 * Math.sin(tSec * 6));
        ctx.fillStyle = `rgba(72,255,160,${lineAlpha})`;
        for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
        ctx.restore();

        // Cursor movement
        const travelStart = 0.8;
        const travelEnd = 1.95;
        const retreatStart = 2.7;
        const retreatEnd = 3.2;

        let cx = sx;
        let cy = sy;
        if (tSec >= travelStart && tSec <= travelEnd) {
          const u = easeOutCubic(clamp01((tSec - travelStart) / (travelEnd - travelStart)));
          cx = lerp(sx, ix, u);
          cy = lerp(sy, iy, u);
        } else if (tSec >= retreatStart && tSec <= retreatEnd) {
          const u = easeInOutCubic(clamp01((tSec - retreatStart) / (retreatEnd - retreatStart)));
          cx = lerp(ix, sx, u);
          cy = lerp(iy, sy, u);
        } else if (tSec > travelEnd && tSec < retreatStart) {
          cx = ix;
          cy = iy;
        }

        // Laser line (during travel)
        if (tSec >= 0.85 && tSec <= 3.65) {
          const a = 0.15 + 0.22 * Math.sin(tSec * 10);
          drawLaser(sx, sy, cx, cy, Math.max(0, a));
        }

        // Cursor ring
        const pulse = 0.5 + 0.5 * Math.sin(tSec * 9);
        drawGlowCircle(cx, cy, 10 + pulse * 6, "rgba(72,255,160,1)", 0.8);
        drawRing(cx, cy, 18 + pulse * 7, "rgba(35,255,255,1)", 0.18, 2.5);

        // Icon selection rings
        const iconOn = tSec >= travelEnd && tSec <= 2.95;
        if (iconOn) {
          const p = 0.55 + 0.45 * Math.sin((tSec - travelEnd) * 12);
          drawRing(ix, iy, 28 + 14 * p, "rgba(72,255,160,1)", 0.18 + 0.22 * p, 3);
          drawRing(ix, iy, 46 + 10 * p, "rgba(35,255,255,1)", 0.1 + 0.1 * p, 2);
        }

        if (!done) raf = requestAnimationFrame(renderFrame);
        else {
          cancelAnimationFrame(raf);
          recorder.stop();
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
        downloadBlob(blob, "robot-back-sales-animation.webm");
        setStatus("done");
      };

      raf = requestAnimationFrame(renderFrame);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container space-y-6">
          <div className="space-y-2">
            <p className="font-display text-sm tracking-[0.3em] uppercase text-primary">Export</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Video from Image</h1>
            <p className="text-muted-foreground max-w-2xl">
              Click <b>Record</b> to animate the robot selecting the Sales Improvement icon and download a{" "}
              <b>.webm</b> file.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4">
              <canvas ref={canvasRef} width={512} height={384} className="w-full h-auto rounded-xl" />
            </div>

            <div className="space-y-4">
              <button
                onClick={record}
                disabled={status === "recording"}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display font-semibold px-8 py-4 rounded-lg text-sm uppercase tracking-wider hover:shadow-[var(--neon-glow-strong)] transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "recording" ? "Recording..." : "Record"}
              </button>

              <div className="text-sm text-muted-foreground">
                Status:{" "}
                <span className="text-foreground">
                  {status === "idle" && "Ready"}
                  {status === "recording" && "Recording"}
                  {status === "done" && "Downloaded"}
                  {status === "error" && "Error"}
                </span>
              </div>

              {error && <div className="text-destructive text-sm">{error}</div>}

              <div className="text-xs text-muted-foreground leading-relaxed">
                Tip: if your browser doesn’t support MediaRecorder WebM, you may need to try Chrome/Chromium.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ExportRobotVideo;

