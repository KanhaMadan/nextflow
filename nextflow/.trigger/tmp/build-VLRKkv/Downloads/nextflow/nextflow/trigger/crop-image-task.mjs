import {
  task
} from "../../../../chunk-L6N4XY53.mjs";
import "../../../../chunk-W3IIWYRQ.mjs";
import {
  __name,
  init_esm
} from "../../../../chunk-CEGEFIIW.mjs";

// trigger/crop-image-task.ts
init_esm();
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import crypto from "crypto";
async function uploadToTransloadit(filePath) {
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
  const blob = new Blob([fileBuffer], { type: "image/jpeg" });
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
var cropImageTask = task({
  id: "crop-image-task",
  maxDuration: 180,
  run: /* @__PURE__ */ __name(async (payload) => {
    const { imageUrl, xPercent, yPercent, widthPercent, heightPercent } = payload;
    const tmpDir = os.tmpdir();
    const inputFile = path.join(tmpDir, `input-${Date.now()}.jpg`);
    const outputFile = path.join(tmpDir, `cropped-${Date.now()}.jpg`);
    try {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to download image: ${imgRes.status}`);
      const buffer = await imgRes.arrayBuffer();
      fs.writeFileSync(inputFile, Buffer.from(buffer));
      const probeOutput = execSync(
        `ffprobe -v quiet -print_format json -show_streams "${inputFile}"`
      ).toString();
      const probeData = JSON.parse(probeOutput);
      const videoStream = probeData.streams?.find(
        (s) => s.codec_type === "video"
      );
      if (!videoStream) throw new Error("Could not read image dimensions");
      const imgWidth = videoStream.width;
      const imgHeight = videoStream.height;
      const cropX = Math.round(xPercent / 100 * imgWidth);
      const cropY = Math.round(yPercent / 100 * imgHeight);
      const cropW = Math.round(widthPercent / 100 * imgWidth);
      const cropH = Math.round(heightPercent / 100 * imgHeight);
      const safeW = Math.max(1, Math.min(cropW, imgWidth - cropX));
      const safeH = Math.max(1, Math.min(cropH, imgHeight - cropY));
      execSync(
        `ffmpeg -i "${inputFile}" -vf "crop=${safeW}:${safeH}:${cropX}:${cropY}" -y "${outputFile}"`
      );
      const croppedImageUrl = await uploadToTransloadit(outputFile);
      return { croppedImageUrl };
    } finally {
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    }
  }, "run")
});
export {
  cropImageTask
};
//# sourceMappingURL=crop-image-task.mjs.map
