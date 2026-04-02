import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const repoRoot = process.cwd();
const fallbackInputPngPath =
  "/Users/mohammedmaqdoom/.cursor/projects/Users-mohammedmaqdoom-Desktop-project-style-karaneon/assets/back-64a031c0-f787-4b1b-b770-bfe5f82370d4.png";

const resolvedInput = fallbackInputPngPath;
if (!fs.existsSync(resolvedInput)) throw new Error(`Missing input PNG: ${resolvedInput}`);

const outPath = path.join(repoRoot, "src", "assets", "sales-improvement-robot-back.webm");
const tmpDir = path.join(repoRoot, ".tmp-robot-video");
fs.mkdirSync(tmpDir, { recursive: true });

const pngBase64 = fs.readFileSync(resolvedInput).toString("base64");
const dataUrl = `data:image/png;base64,${pngBase64}`;

const canvasW = 512;
const canvasH = 384;
const durationMs = 3200;
const fps = 30;

const walkFiles = (dir) => {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(p));
    else out.push(p);
  }
  return out;
};

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
      const start = { x: 500, y: 650 };
      const icon = { x: 220, y: 235 };

      const lerp = (a,b,t) => a + (b-a)*t;
      const clamp01 = (t) => Math.max(0, Math.min(1, t));
      const easeInOutCubic = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
      const easeOutCubic = (t) => 1 - Math.pow(1-t, 3);
      const easeOutSine = (t) => Math.sin((t * Math.PI)/2);

      function glowCircle(x, y, r, color, alpha) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;
        ctx.shadowColor = color;
        ctx.shadowBlur = r*2.5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      }

      function ring(x, y, r, color, alpha, thickness) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = thickness;
        ctx.shadowColor = color;
        ctx.shadowBlur = thickness*3;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.stroke();
        ctx.restore();
      }

      function laser(ax, ay, bx, by, alpha) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(45,255,255,0.18)';
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(80,255,170,0.85)';
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.restore();
      }

      function drawAtTime(tSec) {
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Camera motion.
        const selectStart = 0.7;
        const selectEnd = 1.8;
        const selectT = clamp01((tSec - selectStart) / (selectEnd - selectStart));
        const selectE = easeInOutCubic(selectT);
        const zoom = 1 + 0.04 * easeOutSine(selectE);
        const panX = lerp(0, -165, selectE);
        const panY = lerp(0, -75, selectE);

        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.scale(zoom, zoom);
        ctx.translate(panX, panY);
        ctx.drawImage(img, -imgW/2, -imgH/2, imgW, imgH);
        ctx.restore();

        // Cursor movement.
        const travelStart = 0.8;
        const travelEnd = 1.95;
        const retreatStart = 2.7;
        const retreatEnd = 3.2;

        let cursorPos = start;
        if (tSec >= travelStart && tSec <= travelEnd) {
          const u = easeOutCubic(clamp01((tSec - travelStart) / (travelEnd - travelStart)));
          cursorPos = { x: lerp(start.x, icon.x, u), y: lerp(start.y, icon.y, u) };
        } else if (tSec >= retreatStart && tSec <= retreatEnd) {
          const u = easeInOutCubic(clamp01((tSec - retreatStart) / (retreatEnd - retreatStart)));
          cursorPos = { x: lerp(icon.x, start.x, u), y: lerp(icon.y, start.y, u) };
        } else if (tSec > travelEnd && tSec < retreatStart) {
          cursorPos = icon;
        }

        const cx = cursorPos.x * scale;
        const cy = cursorPos.y * scale;
        const sx = start.x * scale;
        const sy = start.y * scale;
        const ix = icon.x * scale;
        const iy = icon.y * scale;

        // Laser line.
        const laserA = (tSec >= 0.85 && tSec <= 3.05) ? (0.25 + 0.2*Math.sin(tSec*12)) : 0;
        if (laserA > 0.01) laser(sx, sy, cx, cy, laserA);

        // Cursor + pulse.
        const pulse = 0.5 + 0.5*Math.sin(tSec*9);
        glowCircle(cx, cy, 10 + pulse*6, 'rgba(72, 255, 160, 1)', 0.75);
        ring(cx, cy, 18 + pulse*7, 'rgba(35, 255, 255, 1)', 0.18 + 0.08*pulse, 2.5);

        // Icon selection pulse (with extra rings).
        const iconOn = (tSec >= travelEnd && tSec <= 2.95);
        if (iconOn) {
          const p = 0.55 + 0.45*Math.sin((tSec - travelEnd) * 12);
          ring(ix, iy, 28 + 14*p, 'rgba(72,255,160,1)', 0.18 + 0.22*p, 3);
          ring(ix, iy, 46 + 10*p, 'rgba(35,255,255,1)', 0.10 + 0.10*p, 2);
        }

        // Subtle vignette.
        const grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, canvas.width);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,canvas.width,canvas.height);
      }

      (async () => {
        await img.decode();
        const startAt = performance.now();
        const loop = () => {
          const t = performance.now();
          const tSec = (t - startAt) / 1000;
          drawAtTime(tSec);
          if (tSec*1000 < ${durationMs}) requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      })();
    </script>
  </body>
</html>`;

const execPath = await chromium.executablePath();
const browser = await chromium.launch({ headless: true, executablePath: execPath });

const context = await browser.newContext({
  viewport: { width: canvasW, height: canvasH },
  recordVideo: { dir: tmpDir },
});

const page = await context.newPage();
await page.setContent(html, { waitUntil: "load" });

await page.waitForTimeout(durationMs + 600);
await context.close();
await browser.close();

const files = walkFiles(tmpDir).filter((f) => f.endsWith(".webm"));
if (!files.length) throw new Error(`No .webm files produced in ${tmpDir}`);

files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
const newest = files[0];

fs.copyFileSync(newest, outPath);
console.log(`Wrote animation: ${outPath} (from ${newest})`);

