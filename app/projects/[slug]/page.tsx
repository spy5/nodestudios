import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteShell } from "@/components/site-shell"
import { getProjectBySlug, listProjects } from "@/lib/queries"
import { CATEGORIES } from "@/lib/types"
import { MediaBlockRenderer } from "@/components/media-block-renderer"

interface Params {
  slug: string
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: "Project not found" }
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  // Next project (same identity)
  const siblings = listProjects({ identity: project.identity })
  const idx = siblings.findIndex((p) => p.id === project.id)
  const next = siblings[(idx + 1) % siblings.length]

  const category = CATEGORIES.find((c) => c.value === project.category)

  return (
    <SiteShell>
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-10 pb-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Link href="/projects" className="link-underline">Projects</Link>
            <span>/</span>
            <span>{category?.label}</span>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </div>

          {/* Meta */}
          <div className="mt-10 grid grid-cols-12 gap-6 border-b border-border pb-6">
            <div className="col-span-12 md:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {category?.number} · {category?.label}
              </p>
              <h1 className="mt-4 font-display text-[10vw] leading-[0.95] tracking-[-0.035em] md:text-[6vw] lg:text-[5vw] text-balance">
                {project.title}
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 md:pl-8 flex flex-col justify-end gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Year</p>
                <p className="mt-1 font-mono text-sm">{new Date(project.createdAt).getFullYear()}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Identity</p>
                <p className="mt-1 font-mono text-sm uppercase tracking-[0.15em]">
                  {project.identity === "srikar" ? "Srikar Prasad Y" : "NODE Studio"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Tags</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags
                    .split(",")
                    .filter(Boolean)
                    .map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
                      >
                        {t.trim()}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero thumbnail */}
          {project.thumbnail && (
            <div className="mt-10 relative overflow-hidden rounded-md bg-muted aspect-[16/9]">
              <Image
                src={project.thumbnail || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:block md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ Brief</p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.02em] text-pretty">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Blocks */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pb-24">
        <div className="space-y-16 md:space-y-28">
          {project.blocks.map((block, i) => (
            <MediaBlockRenderer key={block.id} block={block} index={i} />
          ))}
        </div>
      </section>

      {/* Next project */}
      {next && next.id !== project.id && (
        <section className="border-t border-border">
          <Link
            href={`/projects/${next.slug}`}
            className="group block mx-auto w-full max-w-[1600px] px-6 md:px-10 py-16 md:py-24"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Next project →</p>
            <div className="mt-6 grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-8">
                <h2 className="font-display text-[12vw] leading-[0.95] tracking-[-0.035em] md:text-[7vw] lg:text-[6vw] group-hover:text-accent transition-colors">
                  {next.title}
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4 flex md:justify-end">
                {next.thumbnail && (
                  <div className="relative overflow-hidden rounded-md bg-muted aspect-[4/3] w-full md:w-60">
                    <Image
                      src={next.thumbnail || "/placeholder.svg"}
                      alt={next.title}
                      fill
                      className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
                      sizes="240px"
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}
    </SiteShell>
  )
}
