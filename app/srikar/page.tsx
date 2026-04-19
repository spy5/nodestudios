import Link from "next/link"
import Image from "next/image"
import { SiteShell } from "@/components/site-shell"
import { getActiveIdentity } from "@/lib/identity"
import { getFeaturedProjects, getHomeContent, listProjects } from "@/lib/queries"
import { CATEGORIES } from "@/lib/types"
import { ProjectMarquee } from "@/components/project-marquee"

export default async function SrikarHomePage() {
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
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="flex flex-col justify-center gap-6">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Featured work</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl">{content.title}</h1>
              <p className="max-w-md text-base text-muted-foreground">{content.subtitle}</p>
            </div>
            <div className="grid gap-2">
              {featured.slice(0, 2).map((project) => (
                <Link
                  key={project.slug}
                  href={`/srikar/projects/${project.slug}`}
                  className="group relative aspect-video overflow-hidden rounded-lg border border-border hover:border-foreground transition-colors"
                >
                  {project.thumbnail && (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end p-4">
                    <span className="font-mono text-xs uppercase tracking-[0.18em]">{project.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-12 md:px-10 md:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">Categories</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/srikar/projects?category=${cat.value}`}
                className="group rounded-lg border border-border p-4 hover:border-foreground transition-colors"
              >
                <div className="font-mono text-sm font-semibold">{cat.number}</div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                  {cat.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Projects */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-12 md:px-10 md:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mb-8">All projects ({total})</p>
          <div className="grid gap-8">
            {allForIdentity.map((project) => (
              <Link
                key={project.slug}
                href={`/srikar/projects/${project.slug}`}
                className="group"
              >
                <div className="grid gap-4 md:grid-cols-2 md:gap-8">
                  {project.thumbnail && (
                    <div className="relative aspect-video overflow-hidden rounded-lg border border-border group-hover:border-foreground transition-colors">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-2xl mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {project.tags?.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 bg-muted rounded text-xs font-mono"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mt-4">
                      View project →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
