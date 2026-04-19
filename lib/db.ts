import "server-only"
import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"

/**
 * Pure-JSON file store. No native bindings.
 * Persists to `.data/store.json` in the project root.
 *
 * Keeps the same record shapes as the previous SQLite schema so queries.ts
 * and auth.ts only had to swap SQL for array operations.
 */

export interface ProjectRow {
  id: string
  title: string
  slug: string
  identity: string
  category: string
  description: string
  thumbnail: string | null
  tags: string
  featured: boolean
  createdAt: string
}
export interface MediaBlockRow {
  id: string
  projectId: string
  type: string
  file: string | null
  url: string | null
  caption: string | null
  order: number
}
export interface UserRow {
  id: string
  email: string
  password: string
}
export interface PageContentRow {
  id: string
  identity: string
  page: string
  content: string // JSON-stringified payload
}
export interface ContactMessageRow {
  id: string
  name: string
  email: string
  message: string
  identity: string
  createdAt: string
}
export interface SessionRow {
  id: string
  userId: string
  createdAt: string
  expiresAt: string
}

export interface Store {
  projects: ProjectRow[]
  blocks: MediaBlockRow[]
  users: UserRow[]
  pages: PageContentRow[]
  messages: ContactMessageRow[]
  sessions: SessionRow[]
}

// Singleton so dev HMR doesn't keep re-reading the file.
declare global {
  // eslint-disable-next-line no-var
  var __json_store: Store | undefined
}

const DB_DIR = path.join(process.cwd(), ".data")
const DB_PATH = path.join(DB_DIR, "store.json")
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

function ensureDirs() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

function emptyStore(): Store {
  return { projects: [], blocks: [], users: [], pages: [], messages: [], sessions: [] }
}

function loadStore(): Store {
  ensureDirs()
  if (!fs.existsSync(DB_PATH)) return emptyStore()
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8")
    const parsed = JSON.parse(raw) as Partial<Store>
    return { ...emptyStore(), ...parsed }
  } catch {
    return emptyStore()
  }
}

export function saveStore(): void {
  if (!global.__json_store) return
  ensureDirs()
  // Atomic-ish write: write to .tmp then rename
  const tmp = DB_PATH + ".tmp"
  fs.writeFileSync(tmp, JSON.stringify(global.__json_store, null, 2), "utf8")
  fs.renameSync(tmp, DB_PATH)
}

export function getStore(): Store {
  if (global.__json_store) return global.__json_store
  const store = loadStore()
  global.__json_store = store
  // First-run seed: if there are no projects AND no users, seed everything.
  if (store.projects.length === 0 && store.users.length === 0) {
    const { seedData } = require("./seed-data") as typeof import("./seed-data")
    seedData(store)
    saveStore()
  }
  return store
}

export function cuid(): string {
  return "c" + crypto.randomBytes(12).toString("hex")
}
