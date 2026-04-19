import Link from "next/link"
import { Plus } from "lucide-react"
import { requireAuth } from "@/lib/auth"
import { listAllProjects } from "@/lib/queries"
import { CATEGORIES } from "@/lib/types"

export const metadata = { title: "Projects" }

export default async function AdminProjectsPage() {
  await requireAuth()
  const projects = listAllProjects()

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 md:py-14 space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Content / 001</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-tight">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent hover:border-accent hover:text-accent-foreground"
        >
          <Plus className="h-4 w-4" />
          New project
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-border">
        <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border bg-muted/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="col-span-4">Title</span>
          <span className="col-span-2">Identity</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Year</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1 text-right">Edit</span>
        </div>

        <ul className="divide-y divide-border">
          {projects.length === 0 && (
            <li className="px-5 py-16 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              No projects yet. Create your first.
            </li>
          )}
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/admin/projects/${p.id}`}
                className="grid grid-cols-12 gap-4 items-center px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="col-span-12 md:col-span-4 min-w-0">
                  <div className="font-display text-lg tracking-tight truncate">{p.title}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-muted-foreground truncate">/{p.slug}</div>
                </div>
                <div className="col-span-4 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.15em]">
                  {p.identity === "srikar" ? "Srikar" : "NODE"}
                </div>
                <div className="col-span-4 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {CATEGORIES.find((c) => c.value === p.category)?.label}
                </div>
                <div className="col-span-4 md:col-span-2 font-mono text-[11px]">
                  {new Date(p.createdAt).getFullYear()}
                </div>
                <div className="hidden md:block md:col-span-1">
                  {p.featured ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-accent-foreground">
                      Star
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Live</span>
                  )}
                </div>
                <div className="hidden md:block md:col-span-1 text-right font-mono text-[11px] uppercase tracking-[0.15em]">
                  Edit →
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
