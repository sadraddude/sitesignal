"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Search, Bell, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MainNavigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="bg-green-500 text-white w-8 h-8 rounded-md flex items-center justify-center">
            <span className="text-sm">🌐</span>
          </div>
          <span>WebInsight Pro</span>
        </Link>

        <nav className="ml-8 flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <BarChart2 className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/website-analyzer"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/website-analyzer") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Search className="h-4 w-4" />
            Website Analyzer
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <Settings className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">John Doe</div>
          </div>
        </div>
      </div>
    </header>
  )
}
