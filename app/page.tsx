import Link from "next/link"
import Image from "next/image"
import { SiteShell } from "@/components/site-shell"
import { getActiveIdentity } from "@/lib/identity"
import { getFeaturedProjects, getHomeContent, listProjects } from "@/lib/queries"
import { CATEGORIES } from "@/lib/types"
import { ProjectMarquee } from "@/components/project-marquee"

export default async function HomePage() {
  const identity = await getActiveIdentity()
  const content = getHomeContent(identity)
  const featured = getFeaturedProjects(identity, content.featuredSlugs)
  const allForIdentity = listProjects({ identity })
  const total = allForIdentity.length

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28">
          {/* Meta row */}
          <div className="grid grid-cols-12 gap-6 border-b border-border pb-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="col-span-4 md:col-span-2">Index / 001</span>
            <span className="col-span-4 md:col-span-3">
              {identity === "srikar" ? "Portfolio" : "Studio"} · {new Date().getFullYear()}
            </span>
            <span className="col-span-4 md:col-span-3 text-right md:text-left">
              {total.toString().padStart(2, "0")} projects on record
            </span>
            <span className="hidden md:block md:col-span-4 text-right">{content.eyebrow}</span>
          </div>

          {/* Headline */}
          <div className="grid grid-cols-12 gap-6 pt-10 md:pt-16">
            <div className="col-span-12 md:col-span-8">
              <h1 className="font-display text-balance text-[12vw] leading-[0.92] tracking-[-0.035em] md:text-[8.5vw] lg:text-[7.5vw]">
                {identity === "srikar" ? (
                  <>
                    Designer of
                    <br />
                    <em className="italic text-accent">considered</em> interfaces,
                    <br />
                    motion & 3D.
                  </>
                ) : (
                  <>
                    A studio for
                    <br />
                    <em className="italic text-accent">considered</em>
                    <br />
                    digital craft.
                  </>
                )}
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 md:pl-8 flex flex-col justify-end">
              <p className="text-base md:text-lg leading-relaxed text-foreground/80 text-pretty max-w-sm">
                {content.intro}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 rounded-full border border-border bg-background px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-background"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  See all projects
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground link-underline"
                >
                  Start a project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Categories marquee */}
        <ProjectMarquee
          items={CATEGORIES.map((c) => c.label).concat(["Brand Systems", "Editorial", "Type Design", "Interactive"])}
        />
      </section>

      {/* FEATURED WORK */}
      <section className="mx-auto w-full max-w-[1600px] px-6 py-20 md:px-10 md:py-32">
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-border pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ 002</p>
            <h2 className="mt-1 font-display text-3xl md:text-5xl tracking-tight">Selected work</h2>
          </div>
          <Link
            href="/projects"
            className="font-mono text-[11px] uppercase tracking-[0.18em] link-underline hidden md:inline-block"
          >
            View all — {total.toString().padStart(2, "0")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 ? (
            <p className="col-span-full text-muted-foreground">No featured projects yet.</p>
          ) : (
            featured.map((p, i) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className={`group block ${i === 0 ? "lg:col-span-2" : ""}`}
              >
                <div className="relative overflow-hidden rounded-md bg-muted aspect-[4/3]">
                  {p.thumbnail && (
                    <Image
                      src={p.thumbnail || "/placeholder.svg"}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                    />
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl md:text-2xl tracking-tight">{p.title}</h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {CATEGORIES.find((c) => c.value === p.category)?.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-prose">{p.description}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* INDEX TABLE */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-16 md:px-10 md:py-24">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ 003</p>
              <h2 className="mt-1 font-display text-3xl md:text-5xl tracking-tight">Index</h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {identity === "srikar" ? "Personal" : "Studio"} · All
            </p>
          </div>

          <div className="divide-y divide-border">
            {/* Table head */}
            <div className="grid grid-cols-12 gap-4 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="col-span-1">No.</span>
              <span className="col-span-5 md:col-span-4">Title</span>
              <span className="col-span-3 md:col-span-2">Category</span>
              <span className="hidden md:block md:col-span-3">Tags</span>
              <span className="col-span-3 md:col-span-2 text-right">Year</span>
            </div>
            {allForIdentity.map((p, i) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="grid grid-cols-12 gap-4 py-5 group items-center hover:bg-background/60 rounded-md transition-colors"
              >
                <span className="col-span-1 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-5 md:col-span-4 font-display text-xl md:text-2xl tracking-tight group-hover:text-accent transition-colors">
                  {p.title}
                </span>
                <span className="col-span-3 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {CATEGORIES.find((c) => c.value === p.category)?.label}
                </span>
                <span className="hidden md:block md:col-span-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground truncate">
                  {p.tags.split(",").filter(Boolean).slice(0, 3).join(" · ")}
                </span>
                <span className="col-span-3 md:col-span-2 text-right font-mono text-xs text-muted-foreground">
                  {new Date(p.createdAt).getFullYear()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
