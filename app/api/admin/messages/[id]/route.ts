import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth"
import { deleteContactMessage } from "@/lib/queries"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  deleteContactMessage(id)
  return NextResponse.json({ ok: true })
}
