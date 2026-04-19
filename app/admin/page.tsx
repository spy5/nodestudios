import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { requireAuth } from "@/lib/auth"
import { getStats, listAllProjects, listContactMessages } from "@/lib/queries"
import { CATEGORIES } from "@/lib/types"

export const metadata = { title: "Dashboard" }

export default async function AdminDashboardPage() {
  await requireAuth()

  const stats = getStats()
  const projects = listAllProjects()
  const messages = listContactMessages()
  const recentProjects = projects.slice(0, 5)
  const recentMessages = messages.slice(0, 5)

  const statCards = [
    { label: "Projects · All", value: stats.projectCount, href: "/admin/projects", sub: "Across both identities" },
    { label: "Srikar", value: stats.srikarCount, href: "/admin/projects", sub: "Personal portfolio" },
    { label: "NODE Studio", value: stats.nodeCount, href: "/admin/projects", sub: "Studio work" },
    { label: "Messages", value: stats.messagesCount, href: "/admin/messages", sub: "Contact inbox" },
  ]

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 md:py-14 space-y-14">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Overview</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col justify-between gap-8 bg-background p-6 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <div>
              <div className="font-display text-6xl tracking-tight">{String(stat.value).padStart(2, "0")}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{stat.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between border-b border-border pb-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recent projects</h2>
            <Link href="/admin/projects" className="font-mono text-[11px] uppercase tracking-[0.15em] link-underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {recentProjects.length === 0 && (
              <li className="py-12 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                No projects yet.
              </li>
            )}
            {recentProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-foreground"
                >
                  <div className="min-w-0">
                    <div className="font-display text-xl tracking-tight truncate">{p.title}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {p.identity === "srikar" ? "Srikar" : "NODE"} · {CATEGORIES.find((c) => c.value === p.category)?.label} ·{" "}
                      {new Date(p.createdAt).getFullYear()}
                    </div>
                  </div>
                  {p.featured ? (
                    <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-foreground">
                      Featured
                    </span>
                  ) : (
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Live
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-baseline justify-between border-b border-border pb-3">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recent messages</h2>
            <Link href="/admin/messages" className="font-mono text-[11px] uppercase tracking-[0.15em] link-underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {recentMessages.length === 0 && (
              <li className="py-12 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Inbox empty.
              </li>
            )}
            {recentMessages.map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl tracking-tight">{m.name}</div>
                    <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">{m.email}</div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.message}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
