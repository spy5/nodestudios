"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { Identity } from "@/lib/types"

export function ContactForm({ identity }: { identity: Identity }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setState("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, identity }),
      })
      if (!res.ok) throw new Error("failed")
      setState("done")
      form.reset()
      toast.success("Message sent. Thank you.")
    } catch (err) {
      setState("idle")
      toast.error("Something went wrong. Try again.")
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-md border border-border bg-muted/30 p-10 md:p-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Received.</p>
        <p className="mt-4 font-display text-3xl md:text-4xl leading-[1.1] tracking-tight">
          Thank you for writing. I'll be in touch within two working days.
        </p>
        <button
          onClick={() => setState("idle")}
          className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] link-underline"
        >
          Send another message →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FieldRow label="01" name="name" placeholder="Your name" required />
      <FieldRow label="02" name="email" type="email" placeholder="your@email.com" required />
      <FieldRow label="03" name="message" placeholder="Tell me about what you're making, the scope, timeline and any references." as="textarea" required />

      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Your message will be delivered to the {identity === "srikar" ? "personal" : "studio"} inbox.
        </p>
        <button
          type="submit"
          disabled={state === "loading"}
          className="group inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground text-background px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:bg-accent hover:border-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {state === "loading" ? "Sending…" : "Send message"}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </form>
  )
}

function FieldRow({
  label,
  name,
  placeholder,
  type = "text",
  required,
  as = "input",
}: {
  label: string
  name: string
  placeholder: string
  type?: string
  required?: boolean
  as?: "input" | "textarea"
}) {
  return (
    <label className="grid grid-cols-12 items-start gap-4 border-b border-border pb-6">
      <span className="col-span-2 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-3">
        {label}
      </span>
      <div className="col-span-10 md:col-span-11">
        {as === "textarea" ? (
          <textarea
            name={name}
            rows={5}
            placeholder={placeholder}
            required={required}
            className="block w-full resize-none bg-transparent font-display text-2xl md:text-3xl leading-snug tracking-tight placeholder:text-muted-foreground/60 outline-none"
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            required={required}
            className="block w-full bg-transparent font-display text-2xl md:text-3xl leading-snug tracking-tight placeholder:text-muted-foreground/60 outline-none"
          />
        )}
      </div>
    </label>
  )
}
