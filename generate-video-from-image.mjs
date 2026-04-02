import fs from "fs";
import path from "path";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const repoRoot = process.cwd();
const inputPngPath = path.join(repoRoot, "src", "assets", "robot-back-sales.png");

if (!fs.existsSync(inputPngPath)) {
  throw new Error(`Missing input PNG: ${inputPngPath}`);
}

const outMp4Path = path.join(repoRoot, "src", "assets", "robot-back-sales-animation.mp4");

const ffmpeg = new FFmpeg();

await ffmpeg.load();

const inputName = "input.png";
const outputName = "out.mp4";

await ffmpeg.writeFile(inputName, await fetchFile(inputPngPath));

// Ken Burns-style zoom (slight in/out feel). This generates a valid encoded MP4.
// Resolution matches your service card feel (square-ish); we pad to keep aspect.
await ffmpeg.exec([
  "-loop",
  "1",
  "-t",
  "4",
  "-i",
  inputName,
  "-vf",
  [
    "scale=512:384:force_original_aspect_ratio=decrease",
    "pad=512:384:(ow-iw)/2:(oh-ih)/2",
    "zoompan=z='1+0.12*on/119':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=120:fps=30:s=512x384",
    "format=yuv420p",
  ].join(","),
  "-an",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  outputName,
]);

const outData = await ffmpeg.readFile(outputName);
fs.writeFileSync(outMp4Path, outData);

console.log(`Wrote: ${outMp4Path} (${outData.length} bytes)`);

