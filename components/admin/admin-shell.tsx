"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { LayoutDashboard, FolderKanban, FileText, Mail, LogOut, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SessionUser } from "@/lib/auth"

export function AdminShell({ user, children }: { user: SessionUser | null; children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/admin/login"

  useEffect(() => {
    document.documentElement.setAttribute("data-admin", "true")
    return () => {
      document.documentElement.removeAttribute("data-admin")
    }
  }, [])

  if (isLogin) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>
  }

  if (!user) {
    // Client-side guard; server pages also call requireUser
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Unauthorized
          </p>
          <Link
            href="/admin/login"
            className="mt-4 inline-block font-display text-3xl link-underline"
          >
            Sign in →
          </Link>
        </div>
      </div>
    )
  }

  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/pages", label: "Pages", icon: FileText },
    { href: "/admin/messages", label: "Messages", icon: Mail },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-border">
          <p className="font-display text-lg tracking-tight">Studio / Admin</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
            Local · SQLite
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
          <p className="px-3 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 border-b border-border bg-background">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-display text-lg">Studio / Admin</p>
          <form action="/api/auth/logout" method="POST">
            <button className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Sign out
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 no-scrollbar">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em]",
                  active ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-[90px] md:pt-0">{children}</main>
    </div>
  )
}
