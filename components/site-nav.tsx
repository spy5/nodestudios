"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useIdentity } from "./identity-provider"
import { IdentitySwitcher } from "./identity-switcher"
import { cn } from "@/lib/utils"

const BASE_NAV_LINKS = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume", nodeLabel: "Clients" },
  { href: "/contact", label: "Contact" },
]

export function SiteNav() {
  const pathname = usePathname()
  const { identity } = useIdentity()
  const [open, setOpen] = useState(false)

  const markLabel = identity === "srikar" ? "Srikar Prasad Y" : "NODE Studio"
  const markSub = identity === "srikar" ? "Independent Designer" : "Multidisciplinary Studio"

  const NAV_LINKS = BASE_NAV_LINKS.map(link => ({
    href: link.href,
    label: identity === "node" && link.nodeLabel ? link.nodeLabel : link.label,
  }))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        {/* Brand */}
        <Link href="/" className="group flex flex-col leading-tight">
          <span className="font-display text-lg md:text-xl tracking-tight">{markLabel}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {markSub}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-xs uppercase tracking-[0.18em] transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-4 bg-current transition-all",
                      active ? "opacity-100" : "opacity-0 -translate-x-1",
                    )}
                  />
                  {link.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Switch + mobile toggle */}
        <div className="flex items-center gap-3">
          <IdentitySwitcher />
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto grid w-full max-w-[1600px] gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-3 font-mono text-xs uppercase tracking-[0.18em]",
                    active ? "bg-muted text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span>{link.label}</span>
                  <span aria-hidden>↗</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
