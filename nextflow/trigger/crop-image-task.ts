// trigger/crop-image-task.ts
// Trigger.dev task: crops an image using FFmpeg
//
// REQUIRED ENV VARIABLES:
//   TRANSLOADIT_AUTH_KEY    = {ENTER YOUR TRANSLOADIT AUTH KEY}
//   TRANSLOADIT_AUTH_SECRET = {ENTER YOUR TRANSLOADIT AUTH SECRET}
//
// FFmpeg is available natively in Trigger.dev cloud runtime
// Output image is re-uploaded via Transloadit and returned as a URL

import { task } from "@trigger.dev/sdk/v3";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import crypto from "crypto";

export interface CropImagePayload {
  imageUrl: string;
  xPercent: number;     // 0–100
  yPercent: number;     // 0–100
  widthPercent: number; // 0–100
  heightPercent: number; // 0–100
}

export interface CropImageOutput {
  croppedImageUrl: string;
}

// Helper: upload a local file to Transloadit and return CDN URL
async function uploadToTransloadit(filePath: string): Promise<string> {
  // TRANSLOADIT_AUTH_KEY = {ENTER YOUR TRANSLOADIT AUTH KEY}
  // TRANSLOADIT_AUTH_SECRET = {ENTER YOUR TRANSLOADIT AUTH SECRET}
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
  const blob = new Blob([fileBuffer], { type: "image/jpeg" });
  formData.append("file", blob, path.basename(filePath));

  const res = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Transloadit upload failed");
  const data = await res.json();
  const assemblyUrl = data.assembly_ssl_url;

  // Poll for completion
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

export const cropImageTask = task({
  id: "crop-image-task",
  maxDuration: 180,

  run: async (payload: CropImagePayload): Promise<CropImageOutput> => {
    const { imageUrl, xPercent, yPercent, widthPercent, heightPercent } = payload;

    const tmpDir = os.tmpdir();
    const inputFile = path.join(tmpDir, `input-${Date.now()}.jpg`);
    const outputFile = path.join(tmpDir, `cropped-${Date.now()}.jpg`);

    try {
      // 1. Download the source image
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      fs.writeFileSync(inputFile, Buffer.from(buffer));

      // 2. Get image dimensions using FFprobe
      const probeOutput = execSync(
        `ffprobe -v quiet -print_format json -show_streams "${inputFile}"`
      ).toString();
      const probeData = JSON.parse(probeOutput);
      const videoStream = probeData.streams?.find(
        (s: { codec_type: string }) => s.codec_type === "video"
      );

      if (!videoStream) throw new Error("Could not read image dimensions");

      const imgWidth: number = videoStream.width;
      const imgHeight: number = videoStream.height;

      // 3. Calculate pixel crop values from percentages
      const cropX = Math.round((xPercent / 100) * imgWidth);
      const cropY = Math.round((yPercent / 100) * imgHeight);
      const cropW = Math.round((widthPercent / 100) * imgWidth);
      const cropH = Math.round((heightPercent / 100) * imgHeight);

      // Clamp to valid range
      const safeW = Math.max(1, Math.min(cropW, imgWidth - cropX));
      const safeH = Math.max(1, Math.min(cropH, imgHeight - cropY));

      // 4. Run FFmpeg crop
      execSync(
        `ffmpeg -i "${inputFile}" -vf "crop=${safeW}:${safeH}:${cropX}:${cropY}" -y "${outputFile}"`
      );

      // 5. Upload result to Transloadit
      const croppedImageUrl = await uploadToTransloadit(outputFile);

      return { croppedImageUrl };
    } finally {
      // Cleanup temp files
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    }
  },
});
