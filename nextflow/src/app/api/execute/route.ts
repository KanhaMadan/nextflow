// // Routes execution to the correct Trigger.dev task based on node type

// import { auth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// // import { tasks } from "@trigger.dev/sdk/v3";
// // import type { llmTask } from "@/../trigger/llm-task";
// // import type { cropImageTask } from "@/../trigger/crop-image-task";
// // import type { extractFrameTask } from "@/../trigger/extract-frame-task";
// import { prisma } from "@/lib/prisma";

// const ExecuteSchema = z.object({
//   nodeId: z.string(),
//   nodeType: z.string(),
//   nodeData: z.record(z.any()),
//   inputs: z.record(z.any()),
//   workflowRunId: z.string(),
// });

// export async function POST(req: NextRequest) {
//   const { userId } = await auth();
//   if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const body = await req.json();
//   const parsed = ExecuteSchema.safeParse(body);
//   if (!parsed.success) {
//     return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
//   }

//   const { nodeId, nodeType, nodeData, inputs, workflowRunId } = parsed.data;
//   const startedAt = new Date();

//   // Create node run record
//   const nodeRun = await prisma.nodeRun.create({
//     data: {
//       workflowRunId,
//       nodeId,
//       nodeType,
//       nodeLabel: (nodeData.label as string) ?? null,
//       status: "RUNNING",
//       inputs,
//       startedAt,
//     },
//   }).catch(() => null);

//   try {
//     let output: string;

//     switch (nodeType) {
//       case "llmNode": {
//         // TRIGGER.DEV: LLM task via Google Gemini
//         // const handle = await tasks.triggerAndWait<typeof llmTask>("llm-task", {
//         const { tasks } = await import("@trigger.dev/sdk/v3");
//         const handle = await tasks.triggerAndWait("llm-task", {
//           model: (nodeData.model as string) ?? "gemini-1.5-flash",
//           systemPrompt: (inputs.system_prompt as string) ?? undefined,
//           userMessage: (inputs.user_message as string) ?? "Hello",
//           images: (inputs.images as string[]) ?? [],
//         });

//         if (handle.ok) {
//           output = handle.output.result;
//         } else {
//           throw new Error(typeof handle.error === "string" ? handle.error : "LLM task failed");
//         }
//         break;
//       }

//       case "cropImageNode": {

//         const { tasks } = await import("@trigger.dev/sdk/v3");

//         // TRIGGER.DEV: FFmpeg crop task
//         const imageUrl = (inputs.image_url as string) ?? (nodeData.imageUrl as string);
//         if (!imageUrl) throw new Error("No image URL provided to crop node");

//         // const handle = await tasks.triggerAndWait<typeof cropImageTask>("crop-image-task", {
//         const handle = await tasks.triggerAndWait("crop-image-task", {
//           imageUrl,
//           xPercent: Number(inputs.x_percent ?? nodeData.xPercent ?? 0),
//           yPercent: Number(inputs.y_percent ?? nodeData.yPercent ?? 0),
//           widthPercent: Number(inputs.width_percent ?? nodeData.widthPercent ?? 100),
//           heightPercent: Number(inputs.height_percent ?? nodeData.heightPercent ?? 100),
//         });

//         if (handle.ok) {
//           output = handle.output.croppedImageUrl;
//         } else {
//           throw new Error(typeof handle.error === "string" ? handle.error : "Crop task failed");
//         }
//         break;
//       }

//       case "extractFrameNode": {

//         const { tasks } = await import("@trigger.dev/sdk/v3");

//         // TRIGGER.DEV: FFmpeg frame extraction task
//         const videoUrl = (inputs.video_url as string) ?? (nodeData.videoUrl as string);
//         if (!videoUrl) throw new Error("No video URL provided to extract frame node");

//         const timestamp = (inputs.timestamp as string) ?? (nodeData.timestamp as string) ?? "0";

//         // const handle = await tasks.triggerAndWait<typeof extractFrameTask>("extract-frame-task", {
//         const handle = await tasks.triggerAndWait("extract-frame-task", {
//           videoUrl,
//           timestamp,
//         });

//         if (handle.ok) {
//           output = handle.output.frameUrl;
//         } else {
//           throw new Error(typeof handle.error === "string" ? handle.error : "Extract frame task failed");
//         }
//         break;
//       }

//       default:
//         return NextResponse.json({ error: `Unknown node type: ${nodeType}` }, { status: 400 });
//     }

//     const duration = Date.now() - startedAt.getTime();

//     // Update node run record
//     if (nodeRun) {
//       await prisma.nodeRun.update({
//         where: { id: nodeRun.id },
//         data: {
//           status: "SUCCESS",
//           outputs: { result: output },
//           completedAt: new Date(),
//           duration,
//         },
//       }).catch(() => {});
//     }

//     return NextResponse.json({ success: true, output });
//   } catch (err) {
//     const error = err instanceof Error ? err.message : "Unknown error";
//     const duration = Date.now() - startedAt.getTime();

//     if (nodeRun) {
//       await prisma.nodeRun.update({
//         where: { id: nodeRun.id },
//         data: {
//           status: "FAILED",
//           error,
//           completedAt: new Date(),
//           duration,
//         },
//       }).catch(() => {});
//     }

//     return NextResponse.json({ success: false, error }, { status: 500 });
//   }
// }



import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ExecuteSchema = z.object({
  nodeId: z.string(),
  nodeType: z.string(),
  nodeData: z.record(z.any()),
  inputs: z.record(z.any()),
  workflowRunId: z.string(),
});

// ── Direct execution functions (no Trigger.dev wrapper needed) ──

async function runLLM(payload: {
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
}): Promise<string> {
  // GEMINI_API_KEY = {your Gemini API key} — set in .env.local
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: payload.model ?? "gemini-1.5-flash",
    ...(payload.systemPrompt
      ? {
        systemInstruction: {
          role: "system",
          parts: [{ text: payload.systemPrompt }],
        },
      }
      : {}),
  });

  const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [];

  // Add images for vision support
  for (const imageUrl of payload.images ?? []) {
    try {
      const res = await fetch(imageUrl);
      if (!res.ok) continue;
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      let mimeType = "image/jpeg";
      const u = imageUrl.toLowerCase();
      if (u.includes(".png")) mimeType = "image/png";
      else if (u.includes(".webp")) mimeType = "image/webp";
      else if (u.includes(".gif")) mimeType = "image/gif";
      parts.push({ inlineData: { mimeType, data: base64 } });
    } catch { }
  }

  parts.push({ text: payload.userMessage });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: parts as never[] }],
    generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
  });

  const text = result.response.text();
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

async function runCropImage(payload: {
  imageUrl: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}): Promise<string> {
  // Uses Transloadit to crop image
  // TRANSLOADIT_AUTH_KEY and TRANSLOADIT_AUTH_SECRET — set in .env.local
  const crypto = await import("crypto");

  const authKey = process.env.TRANSLOADIT_AUTH_KEY!;
  const authSecret = process.env.TRANSLOADIT_AUTH_SECRET!;
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  // Calculate crop as percentages using Transloadit's resize robot
  const params = JSON.stringify({
    auth: { key: authKey, expires },
    steps: {
      ":original": { robot: "/upload/handle" },
      cropped: {
        use: ":original",
        robot: "/image/resize",
        gravity: "NorthWest",
        resize_strategy: "crop",
        width: `${payload.widthPercent}%`,
        height: `${payload.heightPercent}%`,
        zoom: false,
      },
    },
  });

  const signature = crypto
    .default
    .createHmac("sha384", authSecret)
    .update(params)
    .digest("hex");

  // Download source image
  const imgRes = await fetch(payload.imageUrl);
  if (!imgRes.ok) throw new Error("Failed to download image");
  const imgBuffer = await imgRes.arrayBuffer();
  const blob = new Blob([imgBuffer], { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("params", params);
  formData.append("signature", `sha384:${signature}`);
  formData.append("file", blob, "image.jpg");

  const uploadRes = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) throw new Error("Transloadit upload failed");
  const uploadData = await uploadRes.json();
  const assemblyUrl = uploadData.assembly_ssl_url;

  // Poll for result
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const statusRes = await fetch(assemblyUrl);
    const status = await statusRes.json();
    if (status.ok === "ASSEMBLY_COMPLETED") {
      const results = Object.values(status.results ?? {}) as unknown[][];
      const file = results[0]?.[0] as { ssl_url?: string } | undefined;
      if (file?.ssl_url) return file.ssl_url;
      throw new Error("No output from Transloadit");
    }
    if (status.error) throw new Error(status.message ?? "Assembly failed");
  }
  throw new Error("Transloadit timed out");
}

async function runExtractFrame(payload: {
  videoUrl: string;
  timestamp: string;
}): Promise<string> {
  // Uses Transloadit to extract frame from video
  const crypto = await import("crypto");

  const authKey = process.env.TRANSLOADIT_AUTH_KEY!;
  const authSecret = process.env.TRANSLOADIT_AUTH_SECRET!;
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  // Parse timestamp — "50%" or seconds like "5"
  let offsetSeconds = "0";
  const t = payload.timestamp?.trim() ?? "0";
  if (t.endsWith("%")) {
    // Transloadit uses offset in seconds — we'll use a fixed approximation
    // Pass as-is and let Transloadit handle percentage offset
    offsetSeconds = t;
  } else {
    offsetSeconds = t;
  }

  const params = JSON.stringify({
    auth: { key: authKey, expires },
    steps: {
      ":original": { robot: "/upload/handle" },
      frame: {
        use: ":original",
        robot: "/video/thumbs",
        count: 1,
        offsets: [isNaN(Number(offsetSeconds)) ? 0 : Number(offsetSeconds)],
        format: "jpg",
        width: 1280,
        height: 720,
      },
    },
  });

  const signature = crypto.default
    .createHmac("sha384", authSecret)
    .update(params)
    .digest("hex");

  // Download video
  const vidRes = await fetch(payload.videoUrl);
  if (!vidRes.ok) throw new Error("Failed to download video");
  const vidBuffer = await vidRes.arrayBuffer();
  const blob = new Blob([vidBuffer], { type: "video/mp4" });

  const formData = new FormData();
  formData.append("params", params);
  formData.append("signature", `sha384:${signature}`);
  formData.append("file", blob, "video.mp4");

  const uploadRes = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) throw new Error("Transloadit upload failed");
  const uploadData = await uploadRes.json();
  const assemblyUrl = uploadData.assembly_ssl_url;

  // Poll for result
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(assemblyUrl);
    const status = await statusRes.json();
    if (status.ok === "ASSEMBLY_COMPLETED") {
      const results = Object.values(status.results ?? {}) as unknown[][];
      const file = results[0]?.[0] as { ssl_url?: string } | undefined;
      if (file?.ssl_url) return file.ssl_url;
      throw new Error("No output from Transloadit");
    }
    if (status.error) throw new Error(status.message ?? "Assembly failed");
  }
  throw new Error("Transloadit timed out");
}

// ── Main API handler ──────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ExecuteSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { nodeId, nodeType, nodeData, inputs, workflowRunId } = parsed.data;
  const startedAt = new Date();

  const nodeRun = await prisma.nodeRun
    .create({
      data: {
        workflowRunId,
        nodeId,
        nodeType,
        nodeLabel: (nodeData.label as string) ?? null,
        status: "RUNNING",
        inputs,
        startedAt,
      },
    })
    .catch(() => null);

  try {
    let output: string;

    switch (nodeType) {
      case "llmNode": {
        output = await runLLM({
          model: (nodeData.model as string) ?? "gemini-1.5-flash",
          systemPrompt: (inputs.system_prompt as string) ?? undefined,
          userMessage: (inputs.user_message as string) ?? "Hello",
          images: (inputs.images as string[]) ?? [],
        });
        break;
      }

      case "cropImageNode": {
        const imageUrl =
          (inputs.image_url as string) ?? (nodeData.imageUrl as string);
        if (!imageUrl) throw new Error("No image URL provided");
        output = await runCropImage({
          imageUrl,
          xPercent: Number(inputs.x_percent ?? nodeData.xPercent ?? 0),
          yPercent: Number(inputs.y_percent ?? nodeData.yPercent ?? 0),
          widthPercent: Number(
            inputs.width_percent ?? nodeData.widthPercent ?? 100
          ),
          heightPercent: Number(
            inputs.height_percent ?? nodeData.heightPercent ?? 100
          ),
        });
        break;
      }

      case "extractFrameNode": {
        const videoUrl =
          (inputs.video_url as string) ?? (nodeData.videoUrl as string);
        if (!videoUrl) throw new Error("No video URL provided");
        output = await runExtractFrame({
          videoUrl,
          timestamp:
            (inputs.timestamp as string) ??
            (nodeData.timestamp as string) ??
            "0",
        });
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown node type: ${nodeType}` },
          { status: 400 }
        );
    }

    const duration = Date.now() - startedAt.getTime();

    if (nodeRun) {
      await prisma.nodeRun
        .update({
          where: { id: nodeRun.id },
          data: {
            status: "SUCCESS",
            outputs: { result: output },
            completedAt: new Date(),
            duration,
          },
        })
        .catch(() => { });
    }

    return NextResponse.json({ success: true, output });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    const duration = Date.now() - startedAt.getTime();

    if (nodeRun) {
      await prisma.nodeRun
        .update({
          where: { id: nodeRun.id },
          data: {
            status: "FAILED",
            error,
            completedAt: new Date(),
            duration,
          },
        })
        .catch(() => { });
    }

    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}