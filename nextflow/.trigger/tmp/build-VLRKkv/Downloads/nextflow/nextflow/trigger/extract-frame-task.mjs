import {
  task
} from "../../../../chunk-L6N4XY53.mjs";
import "../../../../chunk-W3IIWYRQ.mjs";
import {
  __name,
  init_esm
} from "../../../../chunk-CEGEFIIW.mjs";

// trigger/extract-frame-task.ts
init_esm();
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import crypto from "crypto";
async function uploadToTransloadit(filePath, mimeType = "image/jpeg") {
  const authKey = process.env.TRANSLOADIT_AUTH_KEY;
  const authSecret = process.env.TRANSLOADIT_AUTH_SECRET;
  const expires = new Date(Date.now() + 30 * 60 * 1e3).toISOString();
  const params = JSON.stringify({
    auth: { key: authKey, expires },
    steps: {
      ":original": { robot: "/upload/handle" }
    }
  });
  const signature = crypto.createHmac("sha384", authSecret).update(params).digest("hex");
  const formData = new FormData();
  formData.append("params", params);
  formData.append("signature", `sha384:${signature}`);
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append("file", blob, path.basename(filePath));
  const res = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Transloadit upload failed");
  const data = await res.json();
  const assemblyUrl = data.assembly_ssl_url;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1e3));
    const statusRes = await fetch(assemblyUrl);
    const status = await statusRes.json();
    if (status.ok === "ASSEMBLY_COMPLETED") {
      const results = Object.values(status.results ?? {});
      const file = results[0]?.[0];
      if (file?.ssl_url) return file.ssl_url;
      throw new Error("No output URL from Transloadit");
    }
    if (status.error) throw new Error(status.message ?? "Assembly failed");
  }
  throw new Error("Transloadit assembly timed out");
}
__name(uploadToTransloadit, "uploadToTransloadit");
function parseTimestamp(timestamp, durationSeconds) {
  const trimmed = timestamp.trim();
  if (trimmed.endsWith("%")) {
    const pct = parseFloat(trimmed.replace("%", ""));
    if (isNaN(pct)) throw new Error(`Invalid percentage timestamp: ${timestamp}`);
    return Math.max(0, pct / 100 * durationSeconds);
  }
  const seconds = parseFloat(trimmed);
  if (isNaN(seconds)) throw new Error(`Invalid timestamp: ${timestamp}`);
  return Math.max(0, Math.min(seconds, durationSeconds));
}
__name(parseTimestamp, "parseTimestamp");
var extractFrameTask = task({
  id: "extract-frame-task",
  maxDuration: 180,
  run: /* @__PURE__ */ __name(async (payload) => {
    const { videoUrl, timestamp } = payload;
    const tmpDir = os.tmpdir();
    const inputFile = path.join(tmpDir, `video-${Date.now()}.mp4`);
    const outputFile = path.join(tmpDir, `frame-${Date.now()}.jpg`);
    try {
      const vidRes = await fetch(videoUrl);
      if (!vidRes.ok) throw new Error(`Failed to download video: ${vidRes.status}`);
      const buffer = await vidRes.arrayBuffer();
      fs.writeFileSync(inputFile, Buffer.from(buffer));
      const probeOutput = execSync(
        `ffprobe -v quiet -print_format json -show_streams "${inputFile}"`
      ).toString();
      const probeData = JSON.parse(probeOutput);
      const videoStream = probeData.streams?.find(
        (s) => s.codec_type === "video"
      );
      if (!videoStream) throw new Error("Could not read video metadata");
      const durationSeconds = parseFloat(videoStream.duration ?? "0");
      if (durationSeconds <= 0) throw new Error("Could not determine video duration");
      const seekSeconds = parseTimestamp(timestamp ?? "0", durationSeconds);
      execSync(
        `ffmpeg -ss ${seekSeconds} -i "${inputFile}" -frames:v 1 -q:v 2 -y "${outputFile}"`
      );
      if (!fs.existsSync(outputFile)) {
        throw new Error("FFmpeg did not produce output frame");
      }
      const frameUrl = await uploadToTransloadit(outputFile, "image/jpeg");
      return { frameUrl };
    } finally {
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    }
  }, "run")
});
export {
  extractFrameTask
};
//# sourceMappingURL=extract-frame-task.mjs.map
