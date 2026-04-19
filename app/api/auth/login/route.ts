import { NextResponse } from "next/server"
import { z } from "zod"
import { createSession, ensureAdminExists, verifyLogin } from "@/lib/auth"

const schema = z.object({
  email: z.string().min(1, "Email is required").refine((val) => val.includes("@"), "Invalid email format"),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    await ensureAdminExists()
    const body = await req.json()
    const { email, password } = schema.parse(body)
    const user = await verifyLogin(email, password)
    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 })
    }
    await createSession(user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 })
  }
}
