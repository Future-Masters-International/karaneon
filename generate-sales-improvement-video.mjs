import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const inputPngPath = path.join(
  repoRoot,
  "..",
  "Users-mohammedmaqdoom-Desktop-project-style-karaneon",
  "assets",
  "back-64a031c0-f787-4b1b-b770-bfe5f82370d4.png",
);

// In this environment we can read the provided asset directly from its original location.
const fallbackInputPngPath = "/Users/mohammedmaqdoom/.cursor/projects/Users-mohammedmaqdoom-Desktop-project-style-karaneon/assets/back-64a031c0-f787-4b1b-b770-bfe5f82370d4.png";

const resolvedInput = fs.existsSync(inputPngPath) ? inputPngPath : fallbackInputPngPath;
if (!fs.existsSync(resolvedInput)) {
  throw new Error(`Missing input PNG: ${resolvedInput}`);
}

const outPath = path.join(repoRoot, "src", "assets", "sales-improvement-robot-back.webm");

const pngBase64 = fs.readFileSync(resolvedInput).toString("base64");
const dataUrl = `data:image/png;base64,${pngBase64}`;

const canvasW = 512;
const canvasH = 384;
const durationMs = 3600;
const fps = 30;

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin:0; height:100%; background: #05060a; }
      canvas { display:block; margin:0 auto; width:${canvasW}px; height:${canvasH}px; image-rendering: auto; }
    </style>
  </head>
  <body>
    <canvas id="c" width="${canvasW}" height="${canvasH}"></canvas>
    <script>
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d', { alpha: true });
      const img = new Image();
      img.src = ${JSON.stringify(dataUrl)};

      const imgW = 1024;
      const imgH = 768;
      const scale = ${canvasW} / imgW;

      // Approximated coordinates (tuned for 1024x768 source).
      const start = { x: 500, y: 650 }; // near robot hands (bottom center)
      const icon = { x: 220, y: 235 };  // "Sales Improvement" hex (top-left)

      const lerp = (a,b,t) => a + (b-a)*t;
      const clamp01 = (t) => Math.max(0, Math.min(1, t));
      const easeInOutCubic = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
      const easeOutCubic = (t) => 1 - Math.pow(1-t, 3);

      function drawGlowCircle(x, y, r, color, alpha) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = r * 2.8;
        ctx.fill();
        ctx.restore();
      }

      function drawRing(x, y, r, color, alpha, thickness) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = thickness * 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }

      // Simple deterministic spark generator for stable output.
      let seed = 1337;
      function rand() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }

      let particles = [];
      function resetSparks() {
        particles = [];
        const count = 18;
        for (let i = 0; i < count; i++) {
          const ang = (Math.PI * 2 * i) / count + rand()*0.15;
          const sp = 40 + rand()*80;
          particles.push({
            ang,
            sp,
            life: 0,
            ttl: 0.65 + rand()*0.5,
            r: 10 + rand()*10,
          });
        }
      }

      function drawSparks(originX, originY, t, color) {
        const active = particles.length ? true : false;
        if (!active) return;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (const p of particles) {
          p.life += 1/30;
          const u = clamp01(p.life / p.ttl);
          const k = easeOutCubic(u);
          const x = originX + Math.cos(p.ang) * p.sp * k;
          const y = originY + Math.sin(p.ang) * p.sp * k;
          const a = (1-u) * 0.95;
          drawGlowCircle(x, y, p.r * (0.65 + (1-u)*0.6), color, a);
        }
        ctx.restore();
      }

      function draw() {
        const now = performance.now();
        const t = now / 1000;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Camera / parallax motion (subtle zoom + drift toward the icon).
        const selectStart = 0.8;
        const selectEnd = 2.0;
        const selectT = clamp01((t - selectStart) / (selectEnd - selectStart));
        const selectE = easeInOutCubic(selectT);

        const zoom = 1 + 0.035 * easeOutCubic(selectE);
        const panX = lerp(0, -165, selectE); // move left toward icon
        const panY = lerp(0, -75, selectE);  // move up toward icon

        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.scale(zoom, zoom);
        ctx.translate(panX, panY);
        // Draw centered at origin.
        ctx.drawImage(img, -imgW/2, -imgH/2, imgW, imgH);
        ctx.restore();

        // Timeline for cursor movement.
        const travelStart = 0.9;
        const travelEnd = 2.05;
        const retreatStart = 3.45;
        const retreatEnd = 4.2;

        let cursorPos = start;
        if (t >= travelStart && t <= travelEnd) {
          const u = easeOutCubic(clamp01((t - travelStart) / (travelEnd - travelStart)));
          cursorPos = { x: lerp(start.x, icon.x, u), y: lerp(start.y, icon.y, u) };
        } else if (t >= retreatStart && t <= retreatEnd) {
          const u = easeInOutCubic(clamp01((t - retreatStart) / (retreatEnd - retreatStart)));
          cursorPos = { x: lerp(icon.x, start.x, u), y: lerp(icon.y, start.y, u) };
        } else if (t > travelEnd && t < retreatStart) {
          cursorPos = icon;
        }

        const cx = cursorPos.x * scale;
        const cy = cursorPos.y * scale;
        const sx = start.x * scale;
        const sy = start.y * scale;
        const ix = icon.x * scale;
        const iy = icon.y * scale;

        // Laser-ish line from robot toward cursor/icon.
        const between = (t >= 0.9 && t <= 3.65) ? 1 : 0;
        if (between) {
          const a = 0.18 + 0.35 * Math.sin((t - 0.9) * 10);
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = Math.max(0, a);
          ctx.lineWidth = 4;
          ctx.strokeStyle = 'rgba(80, 255, 170, 0.9)';
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(cx, cy);
          ctx.stroke();

          ctx.globalAlpha = Math.max(0, a*0.65);
          ctx.lineWidth = 10;
          ctx.strokeStyle = 'rgba(35, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(cx, cy);
          ctx.stroke();
          ctx.restore();
        }

        // Cursor
        const hoverU = clamp01((t - travelEnd) / 0.15);
        const hoverPulse = Math.sin(t * 9) * 0.5 + 0.5;
        const cursorAlpha = (t > travelStart && t < retreatEnd) ? 0.9 : 0;
        drawGlowCircle(cx, cy, 10 + hoverPulse * 6, 'rgba(72, 255, 160, 1)', 0.8 * cursorAlpha);
        drawRing(cx, cy, 18 + hoverPulse * 7, 'rgba(35, 255, 255, 1)', 0.25 + hoverU*0.25, 2.5);

        // Icon pulse + sparks at selection.
        const iconSel = clamp01((t - travelEnd) / (3.6 - travelEnd));
        const iconOn = (t >= 2.05 && t <= 3.7);
        if (iconOn && particles.length === 0) resetSparks();

        if (iconOn) {
          const pulse = 0.55 + 0.45 * Math.sin((t - 2.05) * 12);
          const r = (26 + 10 * pulse);
          drawRing(ix, iy, r, 'rgba(72,255,160,1)', 0.22 + 0.25 * pulse, 3);
          drawRing(ix, iy, r + 14, 'rgba(35,255,255,1)', 0.12 + 0.12 * pulse, 2);
          drawRing(ix, iy, r + 28, 'rgba(72,255,160,1)', 0.06 + 0.06 * pulse, 1.5);
          drawSparks(ix, iy, t, 'rgba(72,255,160,1)');
        }

        // Vignette to blend overlay.
        const grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, canvas.width);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,canvas.width,canvas.height);
      }

      (async () => {
        await img.decode();

        const stream = canvas.captureStream(${fps});
        const options = {};
        const preferred = 'video/webm;codecs=vp8';
        if (MediaRecorder.isTypeSupported(preferred)) options.mimeType = preferred;

        const recorder = new MediaRecorder(stream, options);
        const chunks = [];
        recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };

        const startedAt = performance.now();
        recorder.start(250);

        const raf = () => {
          draw();
          if (performance.now() - startedAt < ${durationMs}) {
            requestAnimationFrame(raf);
          }
        };
        requestAnimationFrame(raf);

        await new Promise(resolve => setTimeout(resolve, ${durationMs + 200}));
        recorder.stop();

        await new Promise(resolve => recorder.onstop = resolve);
        const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });

        const reader = new FileReader();
        reader.onload = () => {
          // reader.result is data:video/webm;base64,...
          window.__RECORDED__ = reader.result;
        };
        reader.readAsDataURL(blob);
      })();
    </script>
  </body>
</html>`;

const execPath = await chromium.executablePath();
const browser = await chromium.launch({ headless: true, executablePath: execPath });
const page = await browser.newPage({ viewport: { width: canvasW, height: canvasH } });
await page.setContent(html, { waitUntil: "load" });

// Wait for recording to finish and data URL to be ready.
await page.waitForFunction(() => typeof window.__RECORDED__ === "string", { timeout: durationMs + 5000 });
const recordedDataUrl = await page.evaluate(() => window.__RECORDED__);

await browser.close();

// Strip data URL prefix.
const base64 = recordedDataUrl
  .replace(/^data:video\/webm;base64,/, "")
  .replace(/^data:.*;base64,/, "");
const videoBuffer = Buffer.from(base64, "base64");

fs.writeFileSync(outPath, videoBuffer);
console.log(`Wrote animation: ${outPath} (${videoBuffer.length} bytes)`);

