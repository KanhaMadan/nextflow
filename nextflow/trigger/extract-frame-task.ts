// trigger/extract-frame-task.ts
// Trigger.dev task: extracts a single frame from a video using FFmpeg

// Supports timestamp as:
//   - A number in seconds (e.g., "5" → 5 seconds in)
//   - A percentage string (e.g., "50%" → middle of video)

import { task } from "@trigger.dev/sdk/v3";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import crypto from "crypto";

export interface ExtractFramePayload {
  videoUrl: string;
  timestamp: string; 
}

export interface ExtractFrameOutput {
  frameUrl: string;
}

// Helper: re-used from crop-image-task — uploads file to Transloadit
async function uploadToTransloadit(
  filePath: string,
  mimeType = "image/jpeg"
): Promise<string> {
  const authKey = process.env.TRANSLOADIT_AUTH_KEY!;
  const authSecret = process.env.TRANSLOADIT_AUTH_SECRET!;

  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const params = JSON.stringify({
    auth: { key: authKey, expires },
    steps: {
      ":original": { robot: "/upload/handle" },
    },
  });

  const signature = crypto
    .createHmac("sha384", authSecret)
    .update(params)
    .digest("hex");

  const formData = new FormData();
  formData.append("params", params);
  formData.append("signature", `sha384:${signature}`);

  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append("file", blob, path.basename(filePath));

  const res = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Transloadit upload failed");
  const data = await res.json();
  const assemblyUrl = data.assembly_ssl_url;

  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const statusRes = await fetch(assemblyUrl);
    const status = await statusRes.json();

    if (status.ok === "ASSEMBLY_COMPLETED") {
      const results = Object.values(status.results ?? {}) as unknown[][];
      const file = results[0]?.[0] as { ssl_url?: string } | undefined;
      if (file?.ssl_url) return file.ssl_url;
      throw new Error("No output URL from Transloadit");
    }

    if (status.error) throw new Error(status.message ?? "Assembly failed");
  }

  throw new Error("Transloadit assembly timed out");
}

function parseTimestamp(timestamp: string, durationSeconds: number): number {
  const trimmed = timestamp.trim();

  if (trimmed.endsWith("%")) {
    const pct = parseFloat(trimmed.replace("%", ""));
    if (isNaN(pct)) throw new Error(`Invalid percentage timestamp: ${timestamp}`);
    return Math.max(0, (pct / 100) * durationSeconds);
  }

  const seconds = parseFloat(trimmed);
  if (isNaN(seconds)) throw new Error(`Invalid timestamp: ${timestamp}`);
  return Math.max(0, Math.min(seconds, durationSeconds));
}

export const extractFrameTask = task({
  id: "extract-frame-task",
  maxDuration: 180,

  run: async (payload: ExtractFramePayload): Promise<ExtractFrameOutput> => {
    const { videoUrl, timestamp } = payload;

    const tmpDir = os.tmpdir();
    const inputFile = path.join(tmpDir, `video-${Date.now()}.mp4`);
    const outputFile = path.join(tmpDir, `frame-${Date.now()}.jpg`);

    try {
      // Download the video
      const vidRes = await fetch(videoUrl);
      if (!vidRes.ok) throw new Error(`Failed to download video: ${vidRes.status}`);
      const buffer = await vidRes.arrayBuffer();
      fs.writeFileSync(inputFile, Buffer.from(buffer));

      // Get video duration with FFprobe
      const probeOutput = execSync(
        `ffprobe -v quiet -print_format json -show_streams "${inputFile}"`
      ).toString();
      const probeData = JSON.parse(probeOutput);
      const videoStream = probeData.streams?.find(
        (s: { codec_type: string }) => s.codec_type === "video"
      );

      if (!videoStream) throw new Error("Could not read video metadata");

      const durationSeconds = parseFloat(videoStream.duration ?? "0");
      if (durationSeconds <= 0) throw new Error("Could not determine video duration");

      // Resolve timestamp
      const seekSeconds = parseTimestamp(timestamp ?? "0", durationSeconds);

      // Extract frame at timestamp
      execSync(
        `ffmpeg -ss ${seekSeconds} -i "${inputFile}" -frames:v 1 -q:v 2 -y "${outputFile}"`
      );

      if (!fs.existsSync(outputFile)) {
        throw new Error("FFmpeg did not produce output frame");
      }

      // Upload extracted frame to Transloadit
      const frameUrl = await uploadToTransloadit(outputFile, "image/jpeg");

      return { frameUrl };
    } finally {
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    }
  },
});
