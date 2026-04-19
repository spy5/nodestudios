import { NextResponse } from "next/server"
import { z } from "zod"
import { requireUser } from "@/lib/auth"
import { setPageContent } from "@/lib/queries"

const schema = z.object({
  identity: z.enum(["srikar", "node"]),
  page: z.enum(["home", "about"]),
  content: z.record(z.string(), z.unknown()),
})

export async function PUT(req: Request) {
  try {
    await requireUser()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { identity, page, content } = schema.parse(body)
    setPageContent(identity, page, content)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    const message =
      err?.issues?.[0]?.message || (err instanceof Error ? err.message : "Failed to update page")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
