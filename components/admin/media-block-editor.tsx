"use client"

import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import type { MediaBlockType } from "@/lib/types"
import { FileUpload } from "./file-upload"

export type BlockDraft = {
  type: MediaBlockType
  file: string
  url: string
  caption: string
  order: number
}

type Props = {
  blocks: BlockDraft[]
  onChange: (blocks: BlockDraft[]) => void
}

const BLOCK_TYPES: { type: MediaBlockType; label: string; description: string }[] = [
  { type: "image", label: "Image", description: "A still — JPEG, PNG, WebP or SVG." },
  { type: "video", label: "Video", description: "Upload .mp4 / .webm, or paste a YouTube/Vimeo URL." },
  { type: "figma", label: "Figma", description: "A Figma embed URL for a live prototype." },
  { type: "pdf", label: "PDF", description: "A document, shown inline when possible." },
]

const input =
  "block w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-foreground"

export function MediaBlockEditor({ blocks, onChange }: Props) {
  function addBlock(type: MediaBlockType) {
    onChange([...blocks, { type, file: "", url: "", caption: "", order: blocks.length }])
  }

  function updateBlock(i: number, patch: Partial<BlockDraft>) {
    const next = blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b))
    onChange(next)
  }

  function removeBlock(i: number) {
    onChange(blocks.filter((_, idx) => idx !== i).map((b, idx) => ({ ...b, order: idx })))
  }

  function move(i: number, delta: number) {
    const j = i + delta
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next.map((b, idx) => ({ ...b, order: idx })))
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="overflow-hidden rounded-md border border-border divide-y divide-border">
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">No media blocks yet</p>
            <p className="text-sm text-muted-foreground">Add images, videos, Figma embeds or PDFs below.</p>
          </div>
        )}

        {blocks.map((block, i) => (
          <div key={i} className="grid gap-4 bg-background p-5 md:grid-cols-[auto_1fr_auto]">
            <div className="flex items-start gap-2">
              <GripVertical className="mt-1 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === blocks.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-foreground px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                  {block.type}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Block {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Per-type body */}
              {block.type === "image" && (
                <FileUpload
                  value={block.file || block.url}
                  onChange={(v) => {
                    // Store uploads as file, pasted URLs as url
                    if (v.startsWith("/uploads/")) updateBlock(i, { file: v, url: "" })
                    else updateBlock(i, { file: "", url: v })
                  }}
                  accept="image/*"
                  helpText="Upload or paste a URL"
                />
              )}
              {block.type === "video" && (
                <FileUpload
                  value={block.file || block.url}
                  onChange={(v) => {
                    if (v.startsWith("/uploads/")) updateBlock(i, { file: v, url: "" })
                    else updateBlock(i, { file: "", url: v })
                  }}
                  accept="video/mp4,video/webm"
                  helpText="Upload a video, or paste a YouTube / Vimeo embed URL"
                />
              )}
              {block.type === "figma" && (
                <input
                  value={block.url}
                  onChange={(e) => updateBlock(i, { url: e.target.value, file: "" })}
                  placeholder="https://www.figma.com/embed?embed_host=..."
                  className={`${input} font-mono text-xs`}
                />
              )}
              {block.type === "pdf" && (
                <FileUpload
                  value={block.file || block.url}
                  onChange={(v) => {
                    if (v.startsWith("/uploads/")) updateBlock(i, { file: v, url: "" })
                    else updateBlock(i, { file: "", url: v })
                  }}
                  accept="application/pdf"
                  helpText="Upload a PDF or paste a URL"
                />
              )}

              <input
                value={block.caption}
                onChange={(e) => updateBlock(i, { caption: e.target.value })}
                placeholder="Caption (optional)"
                className={input}
              />
            </div>

            <button
              type="button"
              onClick={() => removeBlock(i)}
              className="self-start text-muted-foreground hover:text-destructive"
              aria-label="Remove block"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground self-center">
          Add block —
        </span>
        {BLOCK_TYPES.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => addBlock(t.type)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] hover:border-foreground"
            title={t.description}
          >
            <Plus className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
