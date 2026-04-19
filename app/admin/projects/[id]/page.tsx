import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { requireAuth } from "@/lib/auth"
import { getProjectById } from "@/lib/queries"
import { ProjectEditor } from "@/components/admin/project-editor"

export const metadata = { title: "Edit project" }

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth()
  const { id } = await params
  const project = getProjectById(id)
  if (!project) notFound()

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 md:py-14 space-y-10">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to projects
        </Link>
        <Link
          href={`/projects/${project.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
        >
          View live
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Editing</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-tight text-balance">{project.title}</h1>
      </div>
      <ProjectEditor mode="edit" project={project} blocks={project.blocks} />
    </div>
  )
}
