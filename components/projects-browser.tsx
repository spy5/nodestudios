"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { CATEGORIES, type Category, type Project } from "@/lib/types"

type ViewMode = "grid" | "index"

export function ProjectsBrowser({
  projects,
  initialCategory,
}: {
  projects: Project[]
  initialCategory?: Category
}) {
  const [category, setCategory] = useState<Category | "all">(initialCategory ?? "all")
  const [view, setView] = useState<ViewMode>("grid")

  const filtered = useMemo(() => {
    if (category === "all") return projects
    return projects.filter((p) => p.category === category)
  }, [projects, category])

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: projects.length }
    for (const c of CATEGORIES) {
      result[c.value] = projects.filter((p) => p.category === c.value).length
    }
    return result
  }, [projects])

  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-10 pb-24">
      {/* Filter bar */}
      <div className="sticky top-[65px] z-30 -mx-6 md:-mx-10 border-y border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 md:px-10 py-3">
          <div className="flex flex-wrap items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em]">
            <button
              onClick={() => setCategory("all")}
              className={cn(
                "rounded-full border border-border px-3 py-1.5 transition-colors",
                category === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "text-muted-foreground hover:text-foreground hover:border-foreground/40",
              )}
            >
              All <span className="ml-1.5 text-[9px] opacity-60">{counts.all}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "rounded-full border border-border px-3 py-1.5 transition-colors",
                  category === c.value
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground hover:text-foreground hover:border-foreground/40",
                )}
              >
                {c.label} <span className="ml-1.5 text-[9px] opacity-60">{counts[c.value] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="inline-flex items-center gap-0 rounded-full border border-border p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                view === "grid" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("index")}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                view === "index" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
              aria-label="Index view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="mt-20 rounded-xl border border-dashed border-border p-16 text-center">
          <p className="font-display text-3xl">Nothing here, yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Try another category.</p>
        </div>
      ) : view === "grid" ? (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectGridCard key={p.id} project={p} index={i} />
          ))}
        </div>
      ) : (
        <IndexTable projects={filtered} />
      )}
    </section>
  )
}

function ProjectGridCard({ project, index }: { project: Project; index: number }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-md bg-muted aspect-[4/3]">
        {project.thumbnail && (
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </div>
        {project.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-foreground">
            Featured
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl md:text-2xl tracking-tight group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {CATEGORIES.find((c) => c.value === project.category)?.label}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2 max-w-prose">{project.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags
          .split(",")
          .filter(Boolean)
          .slice(0, 4)
          .map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
            >
              {t.trim()}
            </span>
          ))}
      </div>
    </Link>
  )
}

function IndexTable({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-12 divide-y divide-border">
      <div className="grid grid-cols-12 gap-4 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="col-span-1">No.</span>
        <span className="col-span-5 md:col-span-4">Title</span>
        <span className="col-span-3 md:col-span-2">Category</span>
        <span className="hidden md:block md:col-span-3">Tags</span>
        <span className="col-span-3 md:col-span-2 text-right">Year</span>
      </div>
      {projects.map((p, i) => (
        <Link
          key={p.id}
          href={`/projects/${p.slug}`}
          className="group grid grid-cols-12 gap-4 items-center py-6 hover:bg-muted/40 rounded-md transition-colors"
        >
          <span className="col-span-1 font-mono text-xs text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="col-span-5 md:col-span-4 flex items-center gap-3">
            {p.thumbnail && (
              <span className="hidden md:block relative h-12 w-16 overflow-hidden rounded border border-border bg-muted">
                <Image
                  src={p.thumbnail || "/placeholder.svg"}
                  alt=""
                  fill
                  className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  sizes="64px"
                />
              </span>
            )}
            <span className="font-display text-xl md:text-2xl tracking-tight group-hover:text-accent transition-colors">
              {p.title}
            </span>
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
  )
}
