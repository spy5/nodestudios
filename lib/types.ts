export type Identity = "srikar" | "node"

export type Category = "uiux" | "video" | "3d" | "vfx"

export const CATEGORIES: { value: Category; label: string; number: string }[] = [
  { value: "uiux", label: "UI / UX", number: "01" },
  { value: "video", label: "Video Editing", number: "02" },
  { value: "3d", label: "3D", number: "03" },
  { value: "vfx", label: "VFX", number: "04" },
]

export const IDENTITIES: { value: Identity; label: string; mark: string; tagline: string }[] = [
  { value: "srikar", label: "Srikar Prasad Y", mark: "S/P", tagline: "Designer · Motion · 3D" },
  { value: "node", label: "NODE Studio", mark: "N/S", tagline: "A multidisciplinary studio" },
]

export type MediaBlockType = "image" | "video" | "figma" | "pdf"

export interface MediaBlock {
  id: string
  projectId: string
  type: MediaBlockType
  file: string | null
  url: string | null
  caption: string | null
  order: number
}

export interface Project {
  id: string
  title: string
  slug: string
  identity: Identity
  category: Category
  description: string
  thumbnail: string | null
  tags: string
  featured: boolean
  createdAt: string
  blocks?: MediaBlock[]
}

export interface PageContent {
  id: string
  identity: Identity
  page: string
  content: Record<string, unknown>
}

export interface HomeContent {
  eyebrow: string
  title: string
  subtitle: string
  intro: string
  featuredSlugs: string[]
}

export interface AboutContent {
  heading: string
  bio: string
  services: { title: string; description: string }[]
  clients: string[]
  contactEmail: string
  socials: { label: string; handle: string }[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  identity: string
  createdAt: string
}
