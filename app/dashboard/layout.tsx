import type React from "react"
import { MainNavigation } from "@/components/main-navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNavigation />
      <main className="flex-1">{children}</main>
    </div>
  )
}
