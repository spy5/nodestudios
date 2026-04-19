import Image from "next/image"
import type { MediaBlock } from "@/lib/types"
import { FileText } from "lucide-react"

export function MediaBlockRenderer({ block, index }: { block: MediaBlock; index: number }) {
  const src = block.file || block.url
  if (!src && block.type !== "pdf") return null

  return (
    <figure className="group">
      <div className="mb-3 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          Fig. {String(index + 1).padStart(2, "0")} — {labelFor(block.type)}
        </span>
        <span className="hidden md:inline">{block.type.toUpperCase()}</span>
      </div>

      {block.type === "image" && src && (
        <div className="relative overflow-hidden rounded-md bg-muted">
          <Image
            src={src || "/placeholder.svg"}
            alt={block.caption || ""}
            width={2400}
            height={1500}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1400px) 100vw, 1400px"
          />
        </div>
      )}

      {block.type === "video" && (
        <div className="relative overflow-hidden rounded-md bg-muted aspect-video">
          {block.url && block.url.includes("youtube") ? (
            <iframe
              src={block.url}
              title={block.caption || "Video"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              src={src!}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      )}

      {block.type === "figma" && block.url && (
        <div className="relative overflow-hidden rounded-md border border-border bg-muted aspect-[16/10]">
          <iframe
            src={block.url}
            title={block.caption || "Figma preview"}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
          />
        </div>
      )}

      {block.type === "pdf" && (
        <div className="relative overflow-hidden rounded-md border border-border bg-muted">
          {src ? (
            <object data={src} type="application/pdf" className="h-[70vh] w-full">
              <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  PDF preview not available inline.
                </p>
                <a
                  href={src}
                  className="rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-foreground hover:text-background"
                >
                  Open PDF
                </a>
              </div>
            </object>
          ) : (
            <div className="flex items-center justify-center p-16 text-muted-foreground">
              <FileText className="h-6 w-6 mr-2" /> No PDF attached.
            </div>
          )}
        </div>
      )}

      {block.caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function labelFor(type: string) {
  switch (type) {
    case "image":
      return "Still"
    case "video":
      return "Motion"
    case "figma":
      return "Prototype"
    case "pdf":
      return "Document"
    default:
      return "Media"
  }
}
