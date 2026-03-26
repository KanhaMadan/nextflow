import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/history/:runId — get node-level details
export async function GET(
  _req: NextRequest,
  { params }: { params: { runId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const run = await prisma.workflowRun.findFirst({
    where: { id: params.runId, userId },
    include: { nodeRuns: { orderBy: { startedAt: "asc" } } },
  });

  if (!run) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(run);
}

// PATCH /api/history/:runId — update run status and duration
const PatchSchema = z.object({
  status: z.enum(["RUNNING", "SUCCESS", "FAILED", "PARTIAL"]),
  duration: z.number().optional(),
  errorMessage: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { runId: string } }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const run = await prisma.workflowRun.findFirst({
    where: { id: params.runId, userId },
  });
  if (!run) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.workflowRun.update({
    where: { id: params.runId },
    data: {
      status: parsed.data.status,
      duration: parsed.data.duration,
      errorMessage: parsed.data.errorMessage,
      completedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
