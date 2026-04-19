"use client"

import { useMemo, useState } from "react"
import { Check, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Identity } from "@/lib/types"

export type PageEntry = {
  key: string
  identity: Identity
  page: "home" | "about"
  label: string
  content: Record<string, unknown>
}

const input =
  "block w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-foreground"

export function PagesEditor({ initialEntries }: { initialEntries: PageEntry[] }) {
  const [entries, setEntries] = useState(initialEntries)
  const [activeKey, setActiveKey] = useState(initialEntries[0]?.key ?? "")
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  const active = useMemo(() => entries.find((e) => e.key === activeKey) ?? null, [entries, activeKey])

  function patchContent(key: string, patch: Record<string, unknown>) {
    setEntries((prev) =>
      prev.map((e) => (e.key === key ? { ...e, content: { ...e.content, ...patch } } : e)),
    )
  }

  async function save(key: string) {
    const entry = entries.find((e) => e.key === key)
    if (!entry) return
    setSavingKey(key)
    try {
      const res = await fetch(`/api/admin/pages`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ identity: entry.identity, page: entry.page, content: entry.content }),
      })
      if (!res.ok) throw new Error("Failed")
      setSavedKey(key)
      toast.success("Saved")
      setTimeout(() => setSavedKey(null), 1800)
    } catch {
      toast.error("Save failed")
    } finally {
      setSavingKey(null)
    }
  }

  if (!active) return <p className="font-mono text-xs text-muted-foreground">No pages configured.</p>

  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-[280px_1fr]">
      <ul className="divide-y divide-border bg-background">
        {entries.map((e) => (
          <li key={e.key}>
            <button
              type="button"
              onClick={() => setActiveKey(e.key)}
              className={`flex w-full flex-col items-start gap-1 px-5 py-4 text-left transition-colors hover:bg-muted/40 ${
                activeKey === e.key ? "bg-muted/60" : ""
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {e.identity === "srikar" ? "Srikar" : "NODE"} · {e.page}
              </span>
              <span className="font-display text-lg tracking-tight">{e.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="bg-background p-6 md:p-10">
        <div className="mb-8 flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Editing</p>
            <h2 className="mt-1 font-display text-3xl tracking-tight">{active.label}</h2>
          </div>
          <button
            type="button"
            onClick={() => save(active.key)}
            disabled={savingKey === active.key}
            className="inline-flex items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-background hover:bg-accent hover:border-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {savedKey === active.key ? (
              <>
                <Check className="h-3.5 w-3.5" /> Saved
              </>
            ) : savingKey === active.key ? (
              "Saving…"
            ) : (
              "Save →"
            )}
          </button>
        </div>

        <ContentFields entry={active} onPatch={(patch) => patchContent(active.key, patch)} />
      </div>
    </div>
  )
}

function ContentFields({
  entry,
  onPatch,
}: {
  entry: PageEntry
  onPatch: (patch: Record<string, unknown>) => void
}) {
  if (entry.page === "home") {
    const c = entry.content as Record<string, any>
    const slugs: string[] = Array.isArray(c.featuredSlugs) ? c.featuredSlugs : []
    return (
      <div className="space-y-5">
        <TextField label="Eyebrow" value={c.eyebrow ?? ""} onChange={(v) => onPatch({ eyebrow: v })} />
        <TextField label="Title" value={c.title ?? ""} onChange={(v) => onPatch({ title: v })} />
        <TextField label="Subtitle" value={c.subtitle ?? ""} onChange={(v) => onPatch({ subtitle: v })} />
        <TextAreaField label="Intro" value={c.intro ?? ""} onChange={(v) => onPatch({ intro: v })} rows={5} />
        <div>
          <Label>Featured slugs (in order)</Label>
          <ul className="mt-3 space-y-2">
            {slugs.map((s, i) => (
              <li key={`${s}-${i}`} className="flex items-center gap-2">
                <input
                  value={s}
                  onChange={(e) => {
                    const next = [...slugs]
                    next[i] = e.target.value
                    onPatch({ featuredSlugs: next })
                  }}
                  className={`${input} font-mono text-xs`}
                />
                <button
                  type="button"
                  onClick={() => onPatch({ featuredSlugs: slugs.filter((_, j) => j !== i) })}
                  className="rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:border-destructive"
                  aria-label="Remove slug"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onPatch({ featuredSlugs: [...slugs, ""] })}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] hover:border-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add slug
          </button>
        </div>
      </div>
    )
  }

  // about
  const c = entry.content as Record<string, any>
  const services: { title: string; description: string }[] = Array.isArray(c.services) ? c.services : []
  const clients: string[] = Array.isArray(c.clients) ? c.clients : []
  const socials: { label: string; handle: string }[] = Array.isArray(c.socials) ? c.socials : []

  return (
    <div className="space-y-8">
      <TextAreaField label="Heading" value={c.heading ?? ""} onChange={(v) => onPatch({ heading: v })} rows={2} />
      <TextAreaField label="Biography" value={c.bio ?? ""} onChange={(v) => onPatch({ bio: v })} rows={6} />

      <div>
        <Label>Services</Label>
        <ul className="mt-3 space-y-3">
          {services.map((s, i) => (
            <li key={i} className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1fr_2fr_auto]">
              <input
                value={s.title}
                onChange={(e) => {
                  const next = [...services]
                  next[i] = { ...next[i], title: e.target.value }
                  onPatch({ services: next })
                }}
                placeholder="Title"
                className={input}
              />
              <input
                value={s.description}
                onChange={(e) => {
                  const next = [...services]
                  next[i] = { ...next[i], description: e.target.value }
                  onPatch({ services: next })
                }}
                placeholder="Description"
                className={input}
              />
              <button
                type="button"
                onClick={() => onPatch({ services: services.filter((_, j) => j !== i) })}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:border-destructive"
                aria-label="Remove service"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onPatch({ services: [...services, { title: "", description: "" }] })}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] hover:border-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add service
        </button>
      </div>

      <div>
        <Label>Clients</Label>
        <div className="mt-3 flex flex-wrap gap-2">
          {clients.map((cl, i) => (
            <span key={`${cl}-${i}`} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em]">
              <input
                value={cl}
                onChange={(e) => {
                  const next = [...clients]
                  next[i] = e.target.value
                  onPatch({ clients: next })
                }}
                className="bg-transparent outline-none w-32"
              />
              <button
                type="button"
                onClick={() => onPatch({ clients: clients.filter((_, j) => j !== i) })}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Remove"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => onPatch({ clients: [...clients, "New client"] })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] hover:border-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>

      <TextField
        label="Contact email"
        value={c.contactEmail ?? ""}
        onChange={(v) => onPatch({ contactEmail: v })}
      />

      <div>
        <Label>Socials</Label>
        <ul className="mt-3 space-y-3">
          {socials.map((s, i) => (
            <li key={i} className="grid gap-2 rounded-md border border-border p-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                value={s.label}
                onChange={(e) => {
                  const next = [...socials]
                  next[i] = { ...next[i], label: e.target.value }
                  onPatch({ socials: next })
                }}
                placeholder="Label — e.g. Instagram"
                className={input}
              />
              <input
                value={s.handle}
                onChange={(e) => {
                  const next = [...socials]
                  next[i] = { ...next[i], handle: e.target.value }
                  onPatch({ socials: next })
                }}
                placeholder="Handle — e.g. @node.studio"
                className={input}
              />
              <button
                type="button"
                onClick={() => onPatch({ socials: socials.filter((_, j) => j !== i) })}
                className="rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:border-destructive"
                aria-label="Remove social"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onPatch({ socials: [...socials, { label: "", handle: "" }] })}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] hover:border-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add social
        </button>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className={`${input} mt-2`} />
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`${input} mt-2 resize-none`}
      />
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{children}</label>
}
