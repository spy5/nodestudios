import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { getStore, saveStore, cuid } from "./db"

const SESSION_COOKIE = "studio_session"
const SESSION_DAYS = 30

export interface SessionUser {
  id: string
  email: string
}

export async function verifyLogin(email: string, password: string): Promise<SessionUser | null> {
  const store = getStore()
  const row = store.users.find((u) => u.email === email)
  if (!row) return null
  const ok = await bcrypt.compare(password, row.password)
  if (!ok) return null
  return { id: row.id, email: row.email }
}

export async function createSession(userId: string): Promise<string> {
  const store = getStore()
  const sid = cuid()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString()
  store.sessions.push({
    id: sid,
    userId,
    createdAt: now.toISOString(),
    expiresAt,
  })
  saveStore()

  const jar = await cookies()
  jar.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
  return sid
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  const sid = jar.get(SESSION_COOKIE)?.value
  if (sid) {
    const store = getStore()
    store.sessions = store.sessions.filter((s) => s.id !== sid)
    saveStore()
  }
  jar.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies()
  const sid = jar.get(SESSION_COOKIE)?.value
  if (!sid) return null
  const store = getStore()
  const session = store.sessions.find((s) => s.id === sid)
  if (!session) return null
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    store.sessions = store.sessions.filter((s) => s.id !== sid)
    saveStore()
    return null
  }
  const user = store.users.find((u) => u.id === session.userId)
  if (!user) return null
  return { id: user.id, email: user.email }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error("UNAUTHORIZED")
  return user
}

// For admin server components: redirect to login if not signed in.
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect("/admin/login")
  return user
}

export async function ensureAdminExists(): Promise<void> {
  const store = getStore()
  if (store.users.length === 0) {
    store.users.push({
      id: cuid(),
      email: "admin@local",
      password: bcrypt.hashSync("admin123", 10),
    })
    saveStore()
  }
}
