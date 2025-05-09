import type React from "react"
import { ProfessionalHeader } from "@/components/professional-header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ProfessionalHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
