import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateRunSchema = z.object({
  workflowId: z.string(),
  scope: z.enum(["FULL", "PARTIAL", "SINGLE"]).default("FULL"),
  nodeCount: z.number().default(0),
  selectedNodeIds: z.array(z.string()).optional(),
});

// GET /api/history?workflowId=xxx
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workflowId = req.nextUrl.searchParams.get("workflowId");
  if (!workflowId) return NextResponse.json({ error: "workflowId required" }, { status: 400 });

  const runs = await prisma.workflowRun.findMany({
    where: { workflowId, userId },
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ runs });
}

// POST /api/history — create a new run record
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateRunSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { workflowId, scope, nodeCount } = parsed.data;

  // Ensure workflow belongs to user (or create a placeholder)
  const workflow = await prisma.workflow.findFirst({ where: { id: workflowId, userId } });
  if (!workflow) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const run = await prisma.workflowRun.create({
    data: { workflowId, userId, scope, nodeCount, status: "RUNNING" },
  });

  return NextResponse.json(run);
}
