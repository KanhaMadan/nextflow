// src/app/api/execute/route.ts
// Routes execution to the correct Trigger.dev task based on node type

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { tasks } from "@trigger.dev/sdk/v3";
import type { llmTask } from "@/../trigger/llm-task";
import type { cropImageTask } from "@/../trigger/crop-image-task";
import type { extractFrameTask } from "@/../trigger/extract-frame-task";
import { prisma } from "@/lib/prisma";

const ExecuteSchema = z.object({
  nodeId: z.string(),
  nodeType: z.string(),
  nodeData: z.record(z.any()),
  inputs: z.record(z.any()),
  workflowRunId: z.string(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ExecuteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { nodeId, nodeType, nodeData, inputs, workflowRunId } = parsed.data;
  const startedAt = new Date();

  // Create node run record
  const nodeRun = await prisma.nodeRun.create({
    data: {
      workflowRunId,
      nodeId,
      nodeType,
      nodeLabel: (nodeData.label as string) ?? null,
      status: "RUNNING",
      inputs,
      startedAt,
    },
  }).catch(() => null);

  try {
    let output: string;

    switch (nodeType) {
      case "llmNode": {
        // TRIGGER.DEV: LLM task via Google Gemini
        const handle = await tasks.triggerAndWait<typeof llmTask>("llm-task", {
          model: (nodeData.model as string) ?? "gemini-1.5-flash",
          systemPrompt: (inputs.system_prompt as string) ?? undefined,
          userMessage: (inputs.user_message as string) ?? "Hello",
          images: (inputs.images as string[]) ?? [],
        });

        if (handle.ok) {
          output = handle.output.result;
        } else {
          throw new Error(handle.error ?? "LLM task failed");
        }
        break;
      }

      case "cropImageNode": {
        // TRIGGER.DEV: FFmpeg crop task
        const imageUrl = (inputs.image_url as string) ?? (nodeData.imageUrl as string);
        if (!imageUrl) throw new Error("No image URL provided to crop node");

        const handle = await tasks.triggerAndWait<typeof cropImageTask>("crop-image-task", {
          imageUrl,
          xPercent: Number(inputs.x_percent ?? nodeData.xPercent ?? 0),
          yPercent: Number(inputs.y_percent ?? nodeData.yPercent ?? 0),
          widthPercent: Number(inputs.width_percent ?? nodeData.widthPercent ?? 100),
          heightPercent: Number(inputs.height_percent ?? nodeData.heightPercent ?? 100),
        });

        if (handle.ok) {
          output = handle.output.croppedImageUrl;
        } else {
          throw new Error(handle.error ?? "Crop task failed");
        }
        break;
      }

      case "extractFrameNode": {
        // TRIGGER.DEV: FFmpeg frame extraction task
        const videoUrl = (inputs.video_url as string) ?? (nodeData.videoUrl as string);
        if (!videoUrl) throw new Error("No video URL provided to extract frame node");

        const timestamp = (inputs.timestamp as string) ?? (nodeData.timestamp as string) ?? "0";

        const handle = await tasks.triggerAndWait<typeof extractFrameTask>("extract-frame-task", {
          videoUrl,
          timestamp,
        });

        if (handle.ok) {
          output = handle.output.frameUrl;
        } else {
          throw new Error(handle.error ?? "Extract frame task failed");
        }
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown node type: ${nodeType}` }, { status: 400 });
    }

    const duration = Date.now() - startedAt.getTime();

    // Update node run record
    if (nodeRun) {
      await prisma.nodeRun.update({
        where: { id: nodeRun.id },
        data: {
          status: "SUCCESS",
          outputs: { result: output },
          completedAt: new Date(),
          duration,
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, output });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    const duration = Date.now() - startedAt.getTime();

    if (nodeRun) {
      await prisma.nodeRun.update({
        where: { id: nodeRun.id },
        data: {
          status: "FAILED",
          error,
          completedAt: new Date(),
          duration,
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
