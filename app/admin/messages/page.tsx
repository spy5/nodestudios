import { requireAuth } from "@/lib/auth"
import { listContactMessages } from "@/lib/queries"
import { MessagesList } from "@/components/admin/messages-list"

export const metadata = { title: "Messages" }

export default async function AdminMessagesPage() {
  await requireAuth()
  const messages = listContactMessages()

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10 md:py-14 space-y-10">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Inbox / 003</p>
        <h1 className="mt-2 font-display text-5xl md:text-6xl tracking-tight">Messages</h1>
      </div>
      <MessagesList initialMessages={messages} />
    </div>
  )
}
