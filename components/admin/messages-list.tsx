"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { ContactMessage } from "@/lib/types"

export function MessagesList({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedId, setSelectedId] = useState<string | null>(messages[0]?.id ?? null)

  const active = messages.find((m) => m.id === selectedId) ?? null

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return
    const prev = messages
    const next = messages.filter((m) => m.id !== id)
    setMessages(next)
    if (selectedId === id) setSelectedId(next[0]?.id ?? null)
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      toast.success("Message deleted")
    } catch {
      setMessages(prev)
      toast.error("Could not delete message")
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-md border border-border p-16 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Inbox empty</p>
        <p className="mt-2 text-sm text-muted-foreground">Messages from your contact form will appear here.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-[320px_1fr]">
      <ul className="divide-y divide-border bg-background">
        {messages.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => setSelectedId(m.id)}
              className={`flex w-full flex-col items-start gap-1 px-5 py-4 text-left transition-colors hover:bg-muted/40 ${
                selectedId === m.id ? "bg-muted/60" : ""
              }`}
            >
              <div className="flex w-full items-baseline justify-between gap-2">
                <span className="font-display text-lg tracking-tight">{m.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {m.identity === "node" ? "NODE" : "SP"}
                </span>
              </div>
              <span className="truncate w-full font-mono text-[11px] text-muted-foreground">{m.email}</span>
              <p className="line-clamp-1 text-xs text-muted-foreground">{m.message}</p>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {new Date(m.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-background p-6 md:p-10">
        {active ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">From</p>
                <h2 className="mt-1 font-display text-3xl tracking-tight">{active.name}</h2>
                <a
                  href={`mailto:${active.email}`}
                  className="mt-1 block font-mono text-xs text-muted-foreground hover:text-foreground link-underline"
                >
                  {active.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${active.email}?subject=${encodeURIComponent(`Re: your enquiry`)}`}
                  className="rounded-full border border-foreground bg-foreground px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-background hover:bg-accent hover:border-accent hover:text-accent-foreground"
                >
                  Reply →
                </a>
                <button
                  type="button"
                  onClick={() => remove(active.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Received — {new Date(active.createdAt).toLocaleString()} ·{" "}
                {active.identity === "node" ? "NODE Studio inbox" : "Personal inbox"}
              </p>
              <p className="mt-6 whitespace-pre-wrap font-display text-2xl md:text-3xl leading-snug tracking-tight">
                {active.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Select a message</p>
          </div>
        )}
      </div>
    </div>
  )
}
