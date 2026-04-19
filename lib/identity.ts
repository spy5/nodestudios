import "server-only"
import { cookies } from "next/headers"
import type { Identity } from "./types"

export const IDENTITY_COOKIE = "studio_identity"

export async function getActiveIdentity(): Promise<Identity> {
  const store = await cookies()
  const v = store.get(IDENTITY_COOKIE)?.value
  return v === "node" ? "node" : "srikar"
}
