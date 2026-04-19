"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { Identity } from "@/lib/types"

interface IdentityContextValue {
  identity: Identity
  setIdentity: (id: Identity) => void
  toggle: () => void
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({
  initial,
  children,
}: {
  initial: Identity
  children: React.ReactNode
}) {
  const [identity, setIdentityState] = useState<Identity>(initial)

  // Keep <html data-identity> in sync with client state
  useEffect(() => {
    document.documentElement.setAttribute("data-identity", identity)
  }, [identity])

  const setIdentity = useCallback(
    (id: Identity) => {
      setIdentityState(id)
    },
    [],
  )

  const toggle = useCallback(() => {
    setIdentityState((current) => (current === "srikar" ? "node" : "srikar"))
  }, [])

  return (
    <IdentityContext.Provider value={{ identity, setIdentity, toggle }}>{children}</IdentityContext.Provider>
  )
}

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider")
  return ctx
}
