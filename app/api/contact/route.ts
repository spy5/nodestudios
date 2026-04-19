import { NextResponse } from "next/server"
import { z } from "zod"
import { createContactMessage } from "@/lib/queries"

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
  identity: z.enum(["srikar", "node"]).default("srikar"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    createContactMessage(data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 })
  }
}
