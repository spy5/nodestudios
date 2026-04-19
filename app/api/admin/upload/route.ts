import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export const runtime = "nodejs"

const MAX_SIZE = 100 * 1024 * 1024 // 100MB

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
])

export async function POST(req: Request) {
  try {
    await requireUser()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "File too large (100MB max)" }, { status: 400 })
    if (file.type && !ALLOWED_TYPES.has(file.type))
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })

    const ext =
      path.extname(file.name) || (file.type === "image/png" ? ".png" : file.type === "application/pdf" ? ".pdf" : "")
    const safeExt = ext.toLowerCase().replace(/[^.\w]/g, "").slice(0, 10)
    const filename = `${randomUUID()}${safeExt}`

    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, filename)

    const bytes = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, bytes)

    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
