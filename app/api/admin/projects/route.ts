import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth"
import { createProject } from "@/lib/queries"

const blockSchema = z.object({
  type: z.enum(["image", "video", "figma", "pdf"]),
  file: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  order: z.number().int().nonnegative(),
})

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes only"),
  identity: z.enum(["srikar", "node"]),
  category: z.enum(["uiux", "video", "3d", "vfx"]),
  description: z.string().max(5000),
  thumbnail: z.string().nullable().optional(),
  tags: z.string().max(400).optional().default(""),
  featured: z.boolean().optional().default(false),
  blocks: z.array(blockSchema).optional().default([]),
})

export async function POST(req: Request) {
  try {
    await requireUser()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const input = projectSchema.parse(body)
    const project = createProject(input)
    return NextResponse.json({ project })
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message || (err instanceof Error ? err.message : "Failed to create project")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
