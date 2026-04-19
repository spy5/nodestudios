import { NextResponse } from "next/server"
import { z } from "zod"
import type { Identity } from "@/lib/types"

const schema = z.object({
  identity: z.enum(["srikar", "node"]),
})

export async function POST(req: Request) {
  console.log('Identity API called with:', req.url)
  try {
    const body = await req.json()
    console.log('Request body:', body)
    const { identity } = schema.parse(body) as { identity: Identity }
    console.log('Setting identity to:', identity)

    const response = NextResponse.json({ success: true })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    // Set the identity cookie
    response.cookies.set("studio_identity", identity, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false, // Allow client-side access
      // Don't set domain to work with both localhost and IP addresses
    })
    console.log('Cookie set in response')

    return response
  } catch (error) {
    console.error('Error in identity API:', error)
    const response = NextResponse.json({ error: "Invalid request" }, { status: 400 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return response
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}