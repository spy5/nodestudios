import { SiteShell } from "@/components/site-shell"
import { getActiveIdentity } from "@/lib/identity"
import { listProjects } from "@/lib/queries"
import type { Category } from "@/lib/types"
import { ProjectsBrowser } from "@/components/projects-browser"

export const metadata = {
  title: "Projects",
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const identity = await getActiveIdentity()
  const { category } = await searchParams
  const projects = listProjects({ identity })
  const activeCategory = (["uiux", "video", "3d", "vfx"] as Category[]).includes(category as Category)
    ? (category as Category)
    : undefined

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-12 pb-10 md:pt-16">
          <div className="grid grid-cols-12 gap-6 border-b border-border pb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="col-span-6 md:col-span-3">Index / 002 — Projects</span>
            <span className="col-span-6 md:col-span-3">
              {identity === "srikar" ? "Personal" : "Studio"} · {projects.length.toString().padStart(2, "0")} records
            </span>
            <span className="hidden md:block md:col-span-6 text-right">
              UI/UX · Video · 3D · VFX
            </span>
          </div>
          <h1 className="mt-10 font-display text-[14vw] leading-[0.9] tracking-[-0.035em] md:text-[9vw] lg:text-[7.5vw]">
            {identity === "srikar" ? (
              <>
                The <em className="italic text-accent">whole</em> archive.
              </>
            ) : (
              <>
                Selected <em className="italic text-accent">studio</em> work.
              </>
            )}
          </h1>
        </div>
      </section>

      <ProjectsBrowser projects={projects} initialCategory={activeCategory} />
    </SiteShell>
  )
}
