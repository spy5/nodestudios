"use client"

import { useIdentity } from "./identity-provider"
import { cn } from "@/lib/utils"

export function IdentitySwitcher({ className }: { className?: string }) {
  const { identity, setIdentity } = useIdentity()

  const handleIdentitySwitch = async (newIdentity: "srikar" | "node") => {
    if (newIdentity === identity) {
      return
    }

    console.log('Switching identity to:', newIdentity)

    try {
      const response = await fetch('/api/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identity: newIdentity }),
      })

      if (!response.ok) {
        console.error('Failed to set identity', await response.text())
        return
      }

      setIdentity(newIdentity)
      document.cookie = `studio_identity=${newIdentity}; path=/; max-age=${60 * 60 * 24 * 365}`
      window.location.reload()
    } catch (error) {
      console.error('Error switching identity:', error)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Switch identity"
      className={cn(
        "relative inline-flex items-center gap-0 rounded-full border border-border bg-background p-1 font-mono text-[10px] uppercase tracking-[0.18em]",
        className,
      )}
    >
      <button
        role="radio"
        aria-checked={identity === "srikar"}
        onClick={() => handleIdentitySwitch("srikar")}
        className={cn(
          "relative z-10 rounded-full px-3 py-1.5 transition-colors",
          identity === "srikar" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Srikar
      </button>
      <button
        role="radio"
        aria-checked={identity === "node"}
        onClick={() => handleIdentitySwitch("node")}
        className={cn(
          "relative z-10 rounded-full px-3 py-1.5 transition-colors",
          identity === "node" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
        )}
      >
        NODE
      </button>
    </div>
  )
}
