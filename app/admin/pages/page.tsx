import { requireAuth } from "@/lib/auth"
import { getAboutContent, getHomeContent } from "@/lib/queries"
import { PagesEditor, type PageEntry } from "@/components/admin/pages-editor"

export const metadata = { title: "Pages" }

export default async function AdminPagesPage() {
  await requireAuth()

  const entries: PageEntry[] = [
    {
      key: "srikar-home",
      identity: "srikar",
      page: "home",
      label: "Srikar — Home",
      content: getHomeContent("srikar") as unknown as Record<string, unknown>,
    },
    {
      key: "srikar-about",
      identity: "srikar",
      page: "about",
      label: "Srikar — About",
      content: getAboutContent("srikar") as unknown as Record<string, unknown>,
    },
    {
      key: "node-home",
      identity: "node",
      page: "home",
      label: "NODE Studio — Home",
      content: getHomeContent("node") as unknown as Record<string, unknown>,
    },
    {
      key: "node-about",
      identity: "node",
      page: "about",
      label: "NODE Studio — About",
      content: getAboutContent("node") as unknown as Record<string, unknown>,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 md:py-14 space-y-10">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Content / 002</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-tight">Pages</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Edit the copy that appears on Home and About for each identity. Changes go live immediately.
        </p>
      </div>
      <PagesEditor initialEntries={entries} />
    </div>
  )
}
