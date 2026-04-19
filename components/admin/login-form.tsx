"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Invalid credentials")
      }
      router.replace("/admin")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Sign-in failed")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="admin@local"
          className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-3 font-mono text-sm outline-none focus:border-foreground"
        />
      </label>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-3 font-mono text-sm outline-none focus:border-foreground"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-md bg-foreground text-background py-3 font-mono text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in →"}
      </button>
    </form>
  )
}
