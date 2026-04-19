"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { Upload, X, FileText } from "lucide-react"
import { toast } from "sonner"

type Props = {
  value: string
  onChange: (url: string) => void
  accept?: string
  helpText?: string
}

export function FileUpload({ value, onChange, accept, helpText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || "Upload failed")
      }
      const j = (await res.json()) as { url: string }
      onChange(j.url)
      toast.success("Upload complete")
    } catch (err: any) {
      toast.error(err?.message || "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const isImage = value && /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(value)
  const isVideo = value && /\.(mp4|webm|mov)(\?|$)/i.test(value)
  const isPdf = value && /\.pdf(\?|$)/i.test(value)
  const isExternal = value && /^https?:\/\//.test(value)

  const inputCls =
    "block w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs outline-none transition-colors focus:border-foreground"

  return (
    <div className="space-y-3">
      {value && (
        <div className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-border bg-muted">
            {isImage ? (
              <Image src={value || "/placeholder.svg"} alt="" fill className="object-cover" sizes="80px" />
            ) : isVideo ? (
              <video src={value} className="h-full w-full object-cover" muted playsInline />
            ) : isPdf ? (
              <div className="flex h-full w-full items-center justify-center">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                {isExternal ? "URL" : "File"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const f = e.dataTransfer.files?.[0]
          if (f) void uploadFile(f)
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-5 text-center transition-colors ${
          dragOver ? "border-foreground bg-muted/40" : "border-border"
        }`}
      >
        <Upload className="h-4 w-4 text-muted-foreground" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {uploading ? "Uploading…" : "Drop file — or —"}
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-foreground bg-foreground px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent hover:border-accent hover:text-accent-foreground disabled:opacity-50"
        >
          Choose file
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void uploadFile(f)
          }}
          className="hidden"
        />
        {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste a URL (https://…  /uploads/…)"
        className={inputCls}
      />
    </div>
  )
}
