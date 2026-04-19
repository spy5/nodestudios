"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useIdentity } from "./identity-provider"

export function SiteFooter() {
  const { identity } = useIdentity()
  const label = identity === "srikar" ? "Srikar Prasad Y" : "NODE Studio"
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const fmt = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
      setTime(`${fmt} IST`)
    }
    tick()
    const i = setInterval(tick, 30_000)
    return () => clearInterval(i)
  }, [])

  return (
    <footer className="border-t border-border mt-32">
      {/* Oversized wordmark */}
      <div className="overflow-hidden border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10">
          <div className="py-16 md:py-24">
            <div className="font-display leading-none tracking-[-0.04em] text-foreground text-[22vw] md:text-[14vw]">
              {identity === "srikar" ? (
                <span>
                  Srikar <em className="italic">Prasad</em> Y
                </span>
              ) : (
                <span>
                  NODE<span className="text-muted-foreground">/Studio</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-8 px-6 py-10 md:grid-cols-12 md:px-10">
        <div className="col-span-2 md:col-span-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Index</p>
          <ul className="mt-3 space-y-1.5 font-mono text-xs uppercase tracking-[0.15em]">
            <li><Link href="/" className="link-underline">Home</Link></li>
            <li><Link href="/projects" className="link-underline">Projects</Link></li>
            <li><Link href="/about" className="link-underline">About</Link></li>
            <li><Link href="/contact" className="link-underline">Contact</Link></li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Elsewhere</p>
          <ul className="mt-3 space-y-1.5 font-mono text-xs uppercase tracking-[0.15em]">
            <li><span className="text-muted-foreground mr-2">IG</span>@{identity === "srikar" ? "srikar.p" : "node.studio"}</li>
            <li><span className="text-muted-foreground mr-2">AR</span>are.na/{identity === "srikar" ? "srikar-prasad" : "node"}</li>
            <li><span className="text-muted-foreground mr-2">VM</span>vimeo.com/{identity === "srikar" ? "srikar" : "node-studio"}</li>
          </ul>
        </div>
        <div className="col-span-2 md:col-span-4 md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Studio</p>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em]">Bengaluru, IN · {time || "—:—"}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            © {new Date().getFullYear()} {label}
          </p>
        </div>
      </div>
    </footer>
  )
}
