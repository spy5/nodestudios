"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import type { Category, Identity, MediaBlock, Project } from "@/lib/types"
import { CATEGORIES } from "@/lib/types"
import { MediaBlockEditor, type BlockDraft } from "./media-block-editor"
import { FileUpload } from "./file-upload"

type Props =
  | { mode: "create"; project?: undefined; blocks?: undefined }
  | { mode: "edit"; project: Project; blocks: MediaBlock[] }

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function ProjectEditor(props: Props) {
  const router = useRouter()
  const { mode } = props
  const existing = mode === "edit" ? props.project : null

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [title, setTitle] = useState(existing?.title ?? "")
  const [slug, setSlug] = useState(existing?.slug ?? "")
  const [slugTouched, setSlugTouched] = useState(mode === "edit")
  const [identity, setIdentity] = useState<Identity>(existing?.identity ?? "srikar")
  const [category, setCategory] = useState<Category>(existing?.category ?? "uiux")
  const [description, setDescription] = useState(existing?.description ?? "")
  const [thumbnail, setThumbnail] = useState<string>(existing?.thumbnail ?? "")
  const [tagsInput, setTagsInput] = useState("")
  const [tags, setTags] = useState<string[]>(
    existing?.tags
      ? existing.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  )
  const [featured, setFeatured] = useState(existing?.featured ?? false)
  const [blocks, setBlocks] = useState<BlockDraft[]>(
    (mode === "edit" ? props.blocks : []).map((b, i) => ({
      type: b.type,
      file: b.file ?? "",
      url: b.url ?? "",
      caption: b.caption ?? "",
      order: b.order ?? i,
    })),
  )

  function onTitleChange(v: string) {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  function addTag() {
    const t = tagsInput.trim()
    if (!t) return
    if (!tags.includes(t)) setTags([...tags, t])
    setTagsInput("")
  }

  async function onSave() {
    if (!title.trim() || !slug.trim()) {
      toast.error("Title and slug are required")
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        identity,
        category,
        description: description.trim(),
        thumbnail: thumbnail || null,
        tags: tags.join(","),
        featured,
        blocks: blocks.map((b, i) => ({
          type: b.type,
          file: b.file?.trim() || null,
          url: b.url?.trim() || null,
          caption: b.caption?.trim() || null,
          order: i,
        })),
      }
      const res = await fetch(
        mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${existing!.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Save failed")
      }
      toast.success(mode === "create" ? "Project created" : "Changes saved")
      router.push("/admin/projects")
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || "Save failed")
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!existing) return
    if (!confirm(`Delete "${existing.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/projects/${existing.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      toast.success("Project deleted")
      router.push("/admin/projects")
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || "Delete failed")
      setDeleting(false)
    }
  }

  const input =
    "block w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-foreground"

  return (
    <div className="space-y-10">
      {/* Core — two columns */}
      <section className="grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
        <Field label="Title" required>
          <input value={title} onChange={(e) => onTitleChange(e.target.value)} className={input} placeholder="Project title" />
        </Field>
        <Field label="Slug" required>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
            className={`${input} font-mono`}
            placeholder="project-slug"
          />
        </Field>
        <Field label="Identity">
          <select value={identity} onChange={(e) => setIdentity(e.target.value as Identity)} className={input}>
            <option value="srikar">Srikar (Personal)</option>
            <option value="node">NODE Studio</option>
          </select>
        </Field>
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.number} — {c.label}
              </option>
            ))}
          </select>
        </Field>
      </section>

      {/* Description */}
      <section>
        <LabelRow label="Description" caption="The brief, as it appears on the project page." />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className={`${input} mt-3 resize-none`}
          placeholder="Write the project brief. Two to four sentences works well."
        />
      </section>

      {/* Tags */}
      <section>
        <LabelRow label="Tags" caption="Used on the listings and project header." />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em]"
            >
              {t}
              <button
                type="button"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault()
                addTag()
              }
            }}
            onBlur={addTag}
            placeholder="Add tag + Enter"
            className={`${input} max-w-xs flex-1`}
          />
        </div>
      </section>

      {/* Thumbnail */}
      <section>
        <LabelRow label="Cover image" caption="Used across the grid, index and project hero." />
        <div className="mt-3">
          <FileUpload value={thumbnail} onChange={setThumbnail} accept="image/*" helpText="Upload an image or paste a URL" />
        </div>
      </section>

      {/* Flags */}
      <section className="flex flex-wrap gap-6 border-y border-border py-5">
        <label className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em]">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-foreground"
          />
          Feature on Home
        </label>
      </section>

      {/* Media blocks */}
      <section>
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <LabelRow label="Media blocks" caption="Stills, motion, Figma embeds and PDFs — in order." compact />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
          </span>
        </div>
        <MediaBlockEditor blocks={blocks} onChange={setBlocks} />
      </section>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 -mx-6 border-t border-border bg-background/95 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {mode === "edit" && (
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting || saving}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:border-destructive hover:text-destructive disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/projects"
              className="rounded-md border border-border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:border-foreground hover:text-foreground"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="rounded-md border border-foreground bg-foreground px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent hover:border-accent hover:text-accent-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-background p-5">
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label} {required && <span className="text-foreground">*</span>}
      </label>
      {children}
    </div>
  )
}

function LabelRow({ label, caption, compact }: { label: string; caption?: string; compact?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ {label}</p>
      {caption && !compact && <p className="mt-1 text-sm text-muted-foreground">{caption}</p>}
    </div>
  )
}
