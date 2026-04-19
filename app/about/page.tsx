import { SiteShell } from "@/components/site-shell"
import { getActiveIdentity } from "@/lib/identity"
import { getAboutContent } from "@/lib/queries"

export const metadata = {
  title: "About",
}

export default async function AboutPage() {
  const identity = await getActiveIdentity()
  const content = getAboutContent(identity)

  return (
    <SiteShell>
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-12 pb-16">
          <div className="grid grid-cols-12 gap-6 border-b border-border pb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="col-span-6 md:col-span-3">Index / 003 — About</span>
            <span className="col-span-6 md:col-span-3">
              {identity === "srikar" ? "Personal" : "Studio"} profile
            </span>
            <span className="hidden md:block md:col-span-6 text-right">
              Based in Bengaluru · Working globally
            </span>
          </div>
          <h1 className="mt-12 font-display text-[10vw] leading-[0.95] tracking-[-0.035em] md:text-[7vw] lg:text-[6vw] text-balance max-w-[18ch]">
            {content.heading}
          </h1>
        </div>
      </section>

      {/* Bio + services */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ Biography</p>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-pretty">{content.bio}</p>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ Practice</p>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {content.services.map((s, i) => (
                <li key={s.title} className="grid grid-cols-12 gap-4 py-6 items-baseline">
                  <span className="col-span-2 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10">
                    <h3 className="font-display text-2xl md:text-3xl tracking-tight">{s.title}</h3>
                    <p className="mt-1 text-muted-foreground">{s.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Clients marquee */}
      {content.clients.length > 0 && (
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-16 md:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              § Selected collaborators
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 lg:grid-cols-6">
              {content.clients.map((c) => (
                <div
                  key={c}
                  className="border-t border-border pt-3 font-display text-2xl md:text-3xl tracking-tight"
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ Contact</p>
            <p className="mt-6 font-display text-4xl md:text-6xl leading-[1] tracking-[-0.02em] text-pretty">
              Currently accepting work for {new Date().getFullYear() + 1}.{" "}
              <a
                href={`mailto:${content.contactEmail}`}
                className="italic text-accent underline underline-offset-8 decoration-accent/40 hover:decoration-accent"
              >
                {content.contactEmail}
              </a>
              .
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 md:pl-8 flex flex-col justify-end">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Elsewhere</p>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {content.socials.map((s) => (
                <li key={s.label} className="flex items-center justify-between py-3">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="font-mono text-xs">{s.handle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
