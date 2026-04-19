import crypto from "node:crypto"
import bcrypt from "bcryptjs"
import type { Store, ProjectRow, MediaBlockRow } from "./db"

function id(): string {
  return "c" + crypto.randomBytes(12).toString("hex")
}

function img(w: number, h: number, q: string): string {
  return `/placeholder.svg?height=${h}&width=${w}&query=${encodeURIComponent(q)}`
}

export function seedData(store: Store) {
  const now = () => new Date().toISOString()

  // --- Admin user ---
  store.users.push({
    id: id(),
    email: "admin@local",
    password: bcrypt.hashSync("admin123", 10),
  })

  // --- Page content: Home (Srikar) ---
  store.pages.push({
    id: id(),
    identity: "srikar",
    page: "home",
    content: JSON.stringify({
      eyebrow: "Good afternoon —",
      title: "Srikar Prasad Y",
      subtitle: "Designer · Motion · 3D",
      intro:
        "I'm an independent designer working at the intersection of interface, motion and three-dimensional craft. I build considered, tactile products — from product design systems to cinematic sequences.",
      featuredSlugs: ["aurora-os", "meridian-timepiece", "ember-title-sequence"],
    }),
  })

  // --- Page content: Home (NODE) ---
  store.pages.push({
    id: id(),
    identity: "node",
    page: "home",
    content: JSON.stringify({
      eyebrow: "— NODE Studio / Est. 2021",
      title: "A studio for considered digital craft.",
      subtitle: "Interfaces, brand systems, motion, 3D.",
      intro:
        "NODE is a small, multidisciplinary studio. We partner with founders, artists and institutions to build enduring digital objects — from product interfaces to feature-length sequences.",
      featuredSlugs: ["halo-commerce", "folio-brand-system", "kiln-interactive-film"],
    }),
  })

  // --- Page content: About (Srikar) ---
  store.pages.push({
    id: id(),
    identity: "srikar",
    page: "about",
    content: JSON.stringify({
      heading: "Working independently since 2019.",
      bio: "I design and build digital products — with a bias toward motion, density and typographic precision. Before going independent, I worked on interface and motion for a handful of studios across Bangalore, Berlin and New York. I care about the seams — the details most people never see.",
      services: [
        { title: "Interface Design", description: "Product design, design systems, prototyping." },
        { title: "Motion & Video", description: "Brand films, title sequences, product motion." },
        { title: "3D & VFX", description: "Cinema 4D, Houdini, Blender. Compositing in Nuke." },
      ],
      clients: ["Linear", "Framer", "Arc", "Rhythm", "Klim", "Field", "Off-Air", "Studio Output"],
      contactEmail: "hello@srikarprasad.com",
      socials: [
        { label: "Instagram", handle: "@srikar.p" },
        { label: "Are.na", handle: "srikar-prasad" },
        { label: "Read.cv", handle: "srikar" },
      ],
    }),
  })

  // --- Page content: About (NODE) ---
  store.pages.push({
    id: id(),
    identity: "node",
    page: "about",
    content: JSON.stringify({
      heading: "A studio by Srikar Prasad Y and collaborators.",
      bio: "NODE is a small studio building considered digital objects — products, brand systems, motion and 3D. We work with a rotating cast of collaborators and typically take on four to six engagements a year.",
      services: [
        { title: "Product", description: "Interfaces, design systems, engineering collaboration." },
        { title: "Brand", description: "Identity systems, guidelines, brand motion." },
        { title: "Film", description: "Commercials, brand films, title design, compositing." },
        { title: "Interactive", description: "Installations, web experiences, generative systems." },
      ],
      clients: ["Halo", "Folio", "Kiln Films", "Meridian", "Ember", "Atlas Residency", "Field Studio"],
      contactEmail: "studio@node.works",
      socials: [
        { label: "Instagram", handle: "@node.studio" },
        { label: "Vimeo", handle: "node-studio" },
        { label: "Are.na", handle: "node" },
      ],
    }),
  })

  type SeedBlock = Omit<MediaBlockRow, "id" | "projectId">
  type SeedProject = { project: Omit<ProjectRow, "id" | "createdAt">; blocks: SeedBlock[] }

  const srikarProjects: SeedProject[] = [
    {
      project: {
        title: "Aurora OS",
        slug: "aurora-os",
        identity: "srikar",
        category: "uiux",
        description:
          "A desktop operating layer exploring ambient computing — where information ambiently reveals itself, and the interface recedes. I led the interaction model, the typographic system and the motion language across 40+ surfaces.",
        thumbnail: img(1600, 1000, "minimal desktop operating system UI dashboard dark editorial"),
        tags: "Product,Systems,Motion",
        featured: true,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "desktop OS dashboard ambient data monochrome"), file: null, caption: "Dashboard — ambient data state.", order: 0 },
        { type: "image", url: img(2000, 1300, "typographic hierarchy exploration design system"), file: null, caption: "Typographic hierarchy exploration.", order: 1 },
        { type: "figma", file: null, url: "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fsample", caption: "Interactive prototype.", order: 2 },
        { type: "video", file: null, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Motion language reel.", order: 3 },
      ],
    },
    {
      project: {
        title: "Meridian Timepiece",
        slug: "meridian-timepiece",
        identity: "srikar",
        category: "3d",
        description:
          "A launch campaign for Meridian — a mechanical timepiece collection. Modeled in Cinema 4D, lit and rendered in Octane. Compositing in Fusion.",
        thumbnail: img(1600, 1000, "luxury mechanical watch macro 3d render cinematic lighting"),
        tags: "3D,Render,Campaign",
        featured: true,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "mechanical watch 3d render hero shot octane"), file: null, caption: "Hero render — Caliber 04.", order: 0 },
        { type: "image", url: img(2000, 1300, "watch movement macro detail 3d render"), file: null, caption: "Macro study of the movement.", order: 1 },
        { type: "video", file: null, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "30-second campaign cut.", order: 2 },
      ],
    },
    {
      project: {
        title: "Ember Title Sequence",
        slug: "ember-title-sequence",
        identity: "srikar",
        category: "video",
        description: "Title sequence for a short film on memory and loss. Edited in Premiere, graded in DaVinci.",
        thumbnail: img(1600, 1000, "cinematic film title typography motion dark amber"),
        tags: "Title Design,Editing,Grade",
        featured: true,
      },
      blocks: [
        { type: "video", file: null, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Full sequence — 01:42.", order: 0 },
        { type: "image", url: img(2000, 1300, "film title typography frame dark cinematic"), file: null, caption: "Type-in-motion frame study.", order: 1 },
      ],
    },
    {
      project: {
        title: "Rhythm — mobile",
        slug: "rhythm-mobile",
        identity: "srikar",
        category: "uiux",
        description: "Redesign of Rhythm's mobile client — a sustained focus on density, gesture and typography.",
        thumbnail: img(1600, 1000, "mobile app ui minimal music listening editorial"),
        tags: "Mobile,Product",
        featured: false,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "mobile app screens minimal ui density"), file: null, caption: "Home — density state.", order: 0 },
      ],
    },
    {
      project: {
        title: "Field VFX Study",
        slug: "field-vfx-study",
        identity: "srikar",
        category: "vfx",
        description: "A personal study on cloth simulation and light wrapping. Houdini, Nuke.",
        thumbnail: img(1600, 1000, "abstract cloth simulation houdini render black"),
        tags: "Houdini,Nuke,Study",
        featured: false,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "cloth simulation abstract render frame 184"), file: null, caption: "Cloth sim — frame 184.", order: 0 },
      ],
    },
  ]

  const nodeProjects: SeedProject[] = [
    {
      project: {
        title: "Halo Commerce",
        slug: "halo-commerce",
        identity: "node",
        category: "uiux",
        description:
          "A headless storefront platform for mid-market brands. NODE led product, brand motion and the initial marketing site. Partnered with Halo's engineering team over nine months.",
        thumbnail: img(1600, 1000, "headless commerce dashboard dark industrial ui"),
        tags: "Product,Brand,Motion",
        featured: true,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "commerce merchant dashboard dark orders view"), file: null, caption: "Merchant dashboard — orders view.", order: 0 },
        { type: "image", url: img(2000, 1300, "ecommerce product page marketing site"), file: null, caption: "Marketing site — product page.", order: 1 },
        { type: "video", file: null, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Launch film — 45s.", order: 2 },
      ],
    },
    {
      project: {
        title: "Folio Brand System",
        slug: "folio-brand-system",
        identity: "node",
        category: "uiux",
        description: "A complete identity system for Folio — a private-office software suite. Wordmark, type system, motion grammar and 60-page guidelines.",
        thumbnail: img(1600, 1000, "brand identity wordmark monogram editorial black"),
        tags: "Brand,Identity,Guidelines",
        featured: true,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "brand identity wordmark primary secondary locks"), file: null, caption: "Wordmark — primary & secondary locks.", order: 0 },
        { type: "image", url: img(2000, 1300, "brand guidelines document spreads"), file: null, caption: "Guidelines — 60 pages.", order: 1 },
      ],
    },
    {
      project: {
        title: "Kiln Interactive Film",
        slug: "kiln-interactive-film",
        identity: "node",
        category: "video",
        description: "A six-minute interactive film for Kiln Residency — branching narrative, generative grade, WebGL composition.",
        thumbnail: img(1600, 1000, "interactive cinematic film dark amber grade"),
        tags: "Film,Interactive,WebGL",
        featured: true,
      },
      blocks: [
        { type: "video", file: null, url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Teaser — branch A.", order: 0 },
        { type: "image", url: img(2000, 1300, "cinematic film still interior scene dark amber"), file: null, caption: "Grade study — interior scene.", order: 1 },
      ],
    },
    {
      project: {
        title: "Atlas — 3D campaign",
        slug: "atlas-3d",
        identity: "node",
        category: "3d",
        description: "Key art and campaign CGI for Atlas Residency's autumn program. Houdini, Redshift, Nuke.",
        thumbnail: img(1600, 1000, "abstract 3d sculpture campaign key art dark"),
        tags: "3D,Campaign,Render",
        featured: false,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "3d abstract sculpture campaign plate 02"), file: null, caption: "Key art — plate 02.", order: 0 },
      ],
    },
    {
      project: {
        title: "Ember VFX",
        slug: "ember-vfx",
        identity: "node",
        category: "vfx",
        description: "Compositing and clean-up for the Ember short film. 140 shots across four weeks.",
        thumbnail: img(1600, 1000, "vfx compositing film still clean plate"),
        tags: "Nuke,Comp,Film",
        featured: false,
      },
      blocks: [
        { type: "image", url: img(2000, 1300, "vfx shot before after film compositing"), file: null, caption: "Shot 084 — before / after.", order: 0 },
      ],
    },
  ]

  const all = [...srikarProjects, ...nodeProjects]
  for (const { project, blocks } of all) {
    const pid = id()
    store.projects.push({ ...project, id: pid, createdAt: now() })
    for (const block of blocks) {
      store.blocks.push({ id: id(), projectId: pid, ...block })
    }
  }
}
