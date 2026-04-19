import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { requireAuth } from "@/lib/auth"
import { ProjectEditor } from "@/components/admin/project-editor"

export const metadata = { title: "New project" }

export default async function NewProjectPage() {
  await requireAuth()

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 md:py-14 space-y-10">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">New record</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-tight">Create project</h1>
      </div>
      <ProjectEditor mode="create" />
    </div>
  )
}
