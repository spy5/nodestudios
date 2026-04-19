import { SiteShell } from "@/components/site-shell"
import { ContactForm } from "@/components/contact-form"
import { getActiveIdentity } from "@/lib/identity"
import { getAboutContent } from "@/lib/queries"

export const metadata = {
  title: "Contact",
}

export default async function ContactPage() {
  const identity = await getActiveIdentity()
  const about = getAboutContent(identity)

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-12 pb-16">
          <div className="grid grid-cols-12 gap-6 border-b border-border pb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="col-span-6 md:col-span-3">Index / 004 — Contact</span>
            <span className="col-span-6 md:col-span-3">
              Messages stored locally, in SQLite.
            </span>
            <span className="hidden md:block md:col-span-6 text-right">
              {identity === "srikar" ? "Personal" : "Studio"} inquiry
            </span>
          </div>

          <div className="mt-10 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <h1 className="font-display text-[12vw] leading-[0.93] tracking-[-0.035em] md:text-[7vw] lg:text-[6vw] text-balance">
                Tell me about the{" "}
                <em className="italic text-accent">problem</em>,
                <br />
                not the solution.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 md:pl-8 flex flex-col justify-end">
              <p className="text-base md:text-lg leading-relaxed text-foreground/80 max-w-sm">
                Freelance, studio engagements and strange experiments — all welcome. Expect a reply within two working
                days.
              </p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Or, directly —
              </p>
              <a
                href={`mailto:${about.contactEmail}`}
                className="mt-1 font-mono text-sm link-underline"
              >
                {about.contactEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="hidden md:block md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">§ Form</p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <ContactForm identity={identity} />
          </div>
          <div className="col-span-12 md:col-span-3 md:pl-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Process</p>
            <ol className="mt-4 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="font-mono text-[10px] text-muted-foreground mt-0.5">01</span>
                <span>A short note from you — scope, timeline, references.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[10px] text-muted-foreground mt-0.5">02</span>
                <span>A call within 48 hours to talk through the brief.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[10px] text-muted-foreground mt-0.5">03</span>
                <span>A written proposal — scope, shape, cost.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
