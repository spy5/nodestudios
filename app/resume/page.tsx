import { SiteShell } from "@/components/site-shell"

export const metadata = {
  title: "Resume",
  description: "Curriculum vitae of Srikar Prasad Y — Designer, Video Editor, Graphic Artist.",
}

type Experience = {
  role: string
  company: string
  location?: string
  period: string
  summary: string
}

type Education = {
  degree: string
  institution: string
  year: string
}

const EXPERIENCES: Experience[] = [
  {
    role: "Video Editor & Graphic Designer",
    company: "Freelancer",
    period: "2012 — Present",
    summary:
      "Worked as a freelancer with various budding startups including evibe.in, GoMalon, Uconnect, reewo, Toonpands, and the IITM Lit-Soc club.",
  },
  {
    role: "Lead Creative Designer",
    company: "Reewo",
    location: "Bengaluru",
    period: "2017 — 2019",
    summary:
      "Content creator for digital marketing, website interface design (reewo.co), retail packaging, 3D animation & renders, social media posts, and ad videos.",
  },
  {
    role: "Graphic Designer",
    company: "ApartmentADDA",
    location: "Bengaluru",
    period: "2017",
    summary:
      "Graphic designer for the ADDA digital marketing team — website graphics, marketing content, illustrations, flyers, posters, and banners.",
  },
]

const EDUCATION: Education[] = [
  {
    degree: "B.Tech, Aerospace Engineering",
    institution: "IIT Madras, Chennai",
    year: "2015",
  },
  {
    degree: "Intermediate",
    institution: "Hyderabad",
    year: "2011",
  },
]

const DISCIPLINES = [
  "Graphic Design",
  "Video Editing",
  "Illustration",
  "3D Modeling",
  "Compositing",
  "Image Manipulation",
  "Typography",
  "Vectorisation",
  "Art Direction",
]

const PLATFORMS = ["WordPress", "Shopify", "Wix"]

const LANGUAGES = [
  { name: "English", level: "Fluent" },
  { name: "Telugu", level: "Native" },
  { name: "Hindi", level: "Conversational" },
]

const INTERESTS = ["Travel", "Music", "Gaming", "Photography"]

const SOCIALS = [
  { label: "Instagram", handle: "@spy.5" },
  { label: "Behance", handle: "SPY5" },
  { label: "Dribbble", handle: "SPY5" },
  { label: "LinkedIn", handle: "in/spy5spy" },
  { label: "Twitter", handle: "@SPYsrikar" },
  { label: "Facebook", handle: "spy5spy" },
]

export default function ResumePage() {
  return (
    <SiteShell>
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-12 pb-16">
          <div className="grid grid-cols-12 gap-6 border-b border-border pb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="col-span-6 md:col-span-3">Index / 004 — Resume</span>
            <span className="col-span-6 md:col-span-3">Curriculum Vitae</span>
            <span className="hidden md:block md:col-span-3">Last updated · {new Date().getFullYear()}</span>
            <span className="hidden md:block md:col-span-3 text-right">
              <a
                href="/documents/spy-resume.pdf"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Download PDF ↓
              </a>
            </span>
          </div>

          <div className="mt-12 grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Srikar Prasad Y — Designer
              </p>
              <h1 className="mt-4 font-display text-[10vw] leading-[0.9] tracking-[-0.04em] md:text-[7vw] lg:text-[6vw] text-balance">
                A decade of
                <br />
                <span className="italic">making things</span>
                <br />
                make sense.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-4 md:pl-8 flex flex-col justify-end gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Contact
              </p>
              <div className="space-y-1 text-sm">
                <p>Bhimavaram, India</p>
                <p>
                  <a
                    href="mailto:ysrikarprasad@gmail.com"
                    className="underline underline-offset-4 decoration-accent/40 hover:decoration-accent"
                  >
                    ysrikarprasad@gmail.com
                  </a>
                </p>
                <p className="font-mono">+91 90252 01122</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-24">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              § 01 — Profile
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 md:pl-8">
            <p className="font-display text-2xl md:text-3xl leading-[1.35] tracking-tight text-pretty max-w-[40ch]">
              I&apos;ve worked as a graphic designer for the past{" "}
              <span className="italic text-accent">eight years</span>, three of those in full-time studio
              roles. Self-taught across nearly every tool, I&apos;ve shipped more than{" "}
              <span className="italic text-accent">500 design projects</span> — from logos, brochures and
              social campaigns to ad videos and crowdfunding films.
            </p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                § 02 — Experience
              </p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {String(EXPERIENCES.length).padStart(2, "0")} roles
              </p>
            </div>
            <div className="col-span-12 md:col-span-9 md:pl-8">
              <ul className="divide-y divide-border border-y border-border">
                {EXPERIENCES.map((e, i) => (
                  <li key={e.role + e.company} className="grid grid-cols-12 gap-4 py-8 md:py-10 items-start">
                    <span className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground pt-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="col-span-10 md:col-span-7">
                      <h3 className="font-display text-2xl md:text-4xl tracking-tight leading-[1.05]">
                        {e.role}
                      </h3>
                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {e.company}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                      <p className="mt-4 text-base md:text-lg leading-relaxed text-pretty max-w-[52ch]">
                        {e.summary}
                      </p>
                    </div>
                    <div className="hidden md:block md:col-span-4 text-right pt-2">
                      <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                        {e.period}
                      </span>
                    </div>
                    <div className="col-span-12 md:hidden">
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {e.period}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              § 03 — Education
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 md:pl-8">
            <ul className="divide-y divide-border border-y border-border">
              {EDUCATION.map((ed, i) => (
                <li key={ed.degree} className="grid grid-cols-12 gap-4 py-6 md:py-8 items-baseline">
                  <span className="col-span-2 md:col-span-1 font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10 md:col-span-8">
                    <h3 className="font-display text-xl md:text-2xl tracking-tight">{ed.degree}</h3>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {ed.institution}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-3 md:text-right">
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {ed.year}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Skills grid */}
      <section className="border-y border-border">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-20 md:py-28">
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                § 04 — Capabilities
              </p>
            </div>
            <div className="col-span-12 md:col-span-9 md:pl-8">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Disciplines
                  </p>
                  <ul className="mt-5 space-y-2">
                    {DISCIPLINES.map((d) => (
                      <li
                        key={d}
                        className="font-display text-xl md:text-2xl tracking-tight leading-[1.1]"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Platforms
                  </p>
                  <ul className="mt-5 space-y-2">
                    {PLATFORMS.map((p) => (
                      <li
                        key={p}
                        className="font-display text-xl md:text-2xl tracking-tight leading-[1.1]"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Interests
                  </p>
                  <ul className="mt-5 space-y-2">
                    {INTERESTS.map((i) => (
                      <li key={i} className="text-base text-muted-foreground">
                        — {i}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Languages
                  </p>
                  <ul className="mt-5 divide-y divide-border border-y border-border">
                    {LANGUAGES.map((l) => (
                      <li key={l.name} className="flex items-baseline justify-between py-3">
                        <span className="font-display text-lg md:text-xl tracking-tight">{l.name}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {l.level}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Elsewhere
                  </p>
                  <ul className="mt-5 divide-y divide-border border-y border-border">
                    {SOCIALS.map((s) => (
                      <li key={s.label} className="flex items-center justify-between py-2.5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {s.label}
                        </span>
                        <span className="font-mono text-xs">{s.handle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="col-span-12 md:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              § 05 — Availability
            </p>
            <p className="mt-6 font-display text-4xl md:text-6xl leading-[1] tracking-[-0.02em] text-pretty">
              Open for select projects in {new Date().getFullYear()}.{" "}
              <a
                href="mailto:ysrikarprasad@gmail.com"
                className="italic text-accent underline underline-offset-8 decoration-accent/40 hover:decoration-accent"
              >
                Say hello
              </a>
              .
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:pl-8">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] hover:bg-foreground hover:text-background transition-colors"
            >
              Start a conversation <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
