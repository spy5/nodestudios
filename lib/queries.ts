import "server-only"
import { getStore, saveStore, cuid, type ProjectRow, type MediaBlockRow } from "./db"
import type {
  AboutContent,
  Category,
  ContactMessage,
  HomeContent,
  Identity,
  MediaBlock,
  Project,
} from "./types"

/* ---------------- Projects ---------------- */

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    identity: row.identity as Identity,
    category: row.category as Category,
    description: row.description,
    thumbnail: row.thumbnail,
    tags: row.tags,
    featured: !!row.featured,
    createdAt: row.createdAt,
  }
}

function rowToBlock(row: MediaBlockRow): MediaBlock {
  return {
    id: row.id,
    projectId: row.projectId,
    type: row.type as MediaBlock["type"],
    file: row.file,
    url: row.url,
    caption: row.caption,
    order: row.order,
  }
}

function sortProjects(a: ProjectRow, b: ProjectRow) {
  // featured first, then newest first
  if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1
  return b.createdAt.localeCompare(a.createdAt)
}

export function listProjects(opts?: { identity?: Identity; category?: Category }): Project[] {
  const store = getStore()
  let rows = store.projects.slice()
  if (opts?.identity) rows = rows.filter((r) => r.identity === opts.identity)
  if (opts?.category) rows = rows.filter((r) => r.category === opts.category)
  rows.sort(sortProjects)
  return rows.map(rowToProject)
}

export function listAllProjects(): Project[] {
  return listProjects()
}

export function getProjectBySlug(slug: string): (Project & { blocks: MediaBlock[] }) | null {
  const store = getStore()
  const row = store.projects.find((r) => r.slug === slug)
  if (!row) return null
  const blocks = store.blocks
    .filter((b) => b.projectId === row.id)
    .sort((a, b) => a.order - b.order)
    .map(rowToBlock)
  return { ...rowToProject(row), blocks }
}

export function getProjectById(id: string): (Project & { blocks: MediaBlock[] }) | null {
  const store = getStore()
  const row = store.projects.find((r) => r.id === id)
  if (!row) return null
  const blocks = store.blocks
    .filter((b) => b.projectId === row.id)
    .sort((a, b) => a.order - b.order)
    .map(rowToBlock)
  return { ...rowToProject(row), blocks }
}

export function getFeaturedProjects(identity: Identity, slugs: string[]): Project[] {
  if (!slugs.length) return []
  const store = getStore()
  const bySlug = new Map<string, Project>()
  for (const r of store.projects) {
    if (r.identity === identity && slugs.includes(r.slug)) {
      bySlug.set(r.slug, rowToProject(r))
    }
  }
  return slugs.map((s) => bySlug.get(s)).filter(Boolean) as Project[]
}

export function createProject(input: {
  title: string
  slug: string
  identity: Identity
  category: Category
  description: string
  thumbnail?: string | null
  tags?: string
  featured?: boolean
  blocks?: Array<Omit<MediaBlock, "id" | "projectId">>
}): Project {
  const store = getStore()
  const id = cuid()
  store.projects.push({
    id,
    title: input.title,
    slug: input.slug,
    identity: input.identity,
    category: input.category,
    description: input.description,
    thumbnail: input.thumbnail ?? null,
    tags: input.tags ?? "",
    featured: !!input.featured,
    createdAt: new Date().toISOString(),
  })
  if (input.blocks?.length) {
    input.blocks.forEach((b, i) => {
      store.blocks.push({
        id: cuid(),
        projectId: id,
        type: b.type,
        file: b.file ?? null,
        url: b.url ?? null,
        caption: b.caption ?? null,
        order: b.order ?? i,
      })
    })
  }
  saveStore()
  return getProjectById(id)!
}

export function updateProject(
  id: string,
  input: {
    title: string
    slug: string
    identity: Identity
    category: Category
    description: string
    thumbnail?: string | null
    tags?: string
    featured?: boolean
    blocks?: Array<Omit<MediaBlock, "id" | "projectId">>
  },
): Project {
  const store = getStore()
  const row = store.projects.find((r) => r.id === id)
  if (!row) throw new Error("Project not found")
  row.title = input.title
  row.slug = input.slug
  row.identity = input.identity
  row.category = input.category
  row.description = input.description
  row.thumbnail = input.thumbnail ?? null
  row.tags = input.tags ?? ""
  row.featured = !!input.featured
  if (input.blocks) {
    // Replace all blocks for this project
    store.blocks = store.blocks.filter((b) => b.projectId !== id)
    input.blocks.forEach((b, i) => {
      store.blocks.push({
        id: cuid(),
        projectId: id,
        type: b.type,
        file: b.file ?? null,
        url: b.url ?? null,
        caption: b.caption ?? null,
        order: b.order ?? i,
      })
    })
  }
  saveStore()
  return getProjectById(id)!
}

export function deleteProject(id: string): void {
  const store = getStore()
  store.projects = store.projects.filter((r) => r.id !== id)
  store.blocks = store.blocks.filter((b) => b.projectId !== id)
  saveStore()
}

/* ---------------- Page Content ---------------- */

const DEFAULT_HOME: HomeContent = {
  eyebrow: "",
  title: "",
  subtitle: "",
  intro: "",
  featuredSlugs: [],
}

const DEFAULT_ABOUT: AboutContent = {
  heading: "",
  bio: "",
  services: [],
  clients: [],
  contactEmail: "",
  socials: [],
}

export function getPageContent<T = Record<string, unknown>>(identity: Identity, page: string): T | null {
  const store = getStore()
  const row = store.pages.find((p) => p.identity === identity && p.page === page)
  if (!row) return null
  try {
    return JSON.parse(row.content) as T
  } catch {
    return null
  }
}

export function getHomeContent(identity: Identity): HomeContent {
  return getPageContent<HomeContent>(identity, "home") ?? DEFAULT_HOME
}

export function getAboutContent(identity: Identity): AboutContent {
  return getPageContent<AboutContent>(identity, "about") ?? DEFAULT_ABOUT
}

export function setPageContent(identity: Identity, page: string, content: Record<string, unknown>): void {
  const store = getStore()
  const json = JSON.stringify(content)
  const existing = store.pages.find((p) => p.identity === identity && p.page === page)
  if (existing) {
    existing.content = json
  } else {
    store.pages.push({ id: cuid(), identity, page, content: json })
  }
  saveStore()
}

/* ---------------- Contact ---------------- */

export function createContactMessage(input: {
  name: string
  email: string
  message: string
  identity: string
}): void {
  const store = getStore()
  store.messages.push({
    id: cuid(),
    name: input.name,
    email: input.email,
    message: input.message,
    identity: input.identity,
    createdAt: new Date().toISOString(),
  })
  saveStore()
}

export function listContactMessages(): ContactMessage[] {
  const store = getStore()
  return store.messages
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      message: r.message,
      identity: r.identity,
      createdAt: r.createdAt,
    }))
}

export function deleteContactMessage(id: string) {
  const store = getStore()
  store.messages = store.messages.filter((m) => m.id !== id)
  saveStore()
}

/* ---------------- Stats ---------------- */

export function getStats() {
  const store = getStore()
  const projectCount = store.projects.length
  const srikarCount = store.projects.filter((p) => p.identity === "srikar").length
  const nodeCount = store.projects.filter((p) => p.identity === "node").length
  const messagesCount = store.messages.length
  return { projectCount, srikarCount, nodeCount, messagesCount }
}
