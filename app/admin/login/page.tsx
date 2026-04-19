import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { LoginForm } from "@/components/admin/login-form"

export const metadata = {
  title: "Sign in",
}

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect("/admin")
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="border-b border-border pb-4 mb-10 flex items-center justify-between">
          <p className="font-display text-2xl tracking-tight">Studio / Admin</p>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            v 0.1.0
          </span>
        </div>
        <h1 className="font-display text-5xl leading-[1] tracking-tight text-balance">
          Sign in to the <em className="italic text-accent">studio</em>.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Local-first CMS for Srikar &amp; NODE Studio.
        </p>

        <div className="mt-10">
          <LoginForm />
        </div>

        <div className="mt-10 rounded-md border border-border bg-muted/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Default credentials
          </p>
          <p className="mt-1 font-mono text-xs">admin@local · admin123</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Change these after first sign-in from the Admin → Account panel (coming soon). The password is hashed with bcrypt before storage.
          </p>
        </div>
      </div>
    </div>
  )
}
