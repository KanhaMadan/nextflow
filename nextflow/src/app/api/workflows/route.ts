// src/app/api/workflows/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SaveSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(200),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
  viewport: z.any().optional(),
});

// GET /api/workflows — list user's workflows
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workflows = await prisma.workflow.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, updatedAt: true, createdAt: true },
  });

  return NextResponse.json({ workflows });
}

// POST /api/workflows — create or update
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = SaveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { id, name, nodes, edges, viewport } = parsed.data;

  if (id) {
    // Verify ownership
    const existing = await prisma.workflow.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.workflow.update({
      where: { id },
      data: { name, nodes, edges, viewport },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.workflow.create({
    data: { userId, name, nodes, edges, viewport },
  });
  return NextResponse.json(created);
}
