"use client"

export function ProjectMarquee({ items }: { items: string[] }) {
  // Duplicate content for seamless loop
  const line = items.join("  ·  ")
  return (
    <div className="border-t border-b border-border overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground px-6"
          >
            {line}  ·  
          </span>
        ))}
      </div>
    </div>
  )
}
