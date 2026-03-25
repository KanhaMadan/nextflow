// src/app/api/upload/route.ts
// Handles file uploads via Transloadit
// TRANSLOADIT_AUTH_KEY = {ENTER YOUR TRANSLOADIT AUTH KEY}
// TRANSLOADIT_AUTH_SECRET = {ENTER YOUR TRANSLOADIT AUTH SECRET}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const TRANSLOADIT_AUTH_KEY = process.env.TRANSLOADIT_AUTH_KEY!;
const TRANSLOADIT_AUTH_SECRET = process.env.TRANSLOADIT_AUTH_SECRET!;

function createTransloaditSignature(params: string): string {
  return crypto
    .createHmac("sha384", TRANSLOADIT_AUTH_SECRET)
    .update(params)
    .digest("hex");
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Build Transloadit params
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
  const params = JSON.stringify({
    auth: {
      key: TRANSLOADIT_AUTH_KEY,
      expires,
    },
    steps: {
      ":original": {
        robot: "/upload/handle",
      },
      exported: {
        use: ":original",
        robot: "/file/compress", // pass-through
        preserve_meta_data: false,
      },
    },
  });

  const signature = createTransloaditSignature(params);

  // Build multipart form for Transloadit
  const tFormData = new FormData();
  tFormData.append("params", params);
  tFormData.append("signature", `sha384:${signature}`);
  tFormData.append("file", file, file.name);

  const uploadRes = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body: tFormData,
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    console.error("Transloadit error:", text);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const uploadData = await uploadRes.json();

  // Poll for completion
  const assemblyUrl = uploadData.assembly_ssl_url;
  let attempts = 0;

  while (attempts < 30) {
    await new Promise((r) => setTimeout(r, 1000));
    const statusRes = await fetch(assemblyUrl);
    const status = await statusRes.json();

    if (status.ok === "ASSEMBLY_COMPLETED") {
      // Get the first result file URL
      const results = Object.values(status.results ?? {}) as unknown[][];
      const firstFile = results[0]?.[0] as { ssl_url?: string; url?: string } | undefined;
      const url = firstFile?.ssl_url ?? firstFile?.url;

      if (url) {
        return NextResponse.json({ url });
      }
      break;
    }

    if (status.error) {
      return NextResponse.json({ error: status.message ?? "Upload failed" }, { status: 500 });
    }

    attempts++;
  }

  return NextResponse.json({ error: "Upload timed out" }, { status: 500 });
}
