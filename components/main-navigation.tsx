"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import { BarChart2, Search, Settings, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function MainNavigation() {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/ChatGPT Image Apr 30, 2025, 12_14_26 PM.png" alt="Logo" width={24} height={24} className="mr-2" />
          <span>SiteSignal</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">App Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>Notifications (soon)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{user.fullName || user.firstName || 'User'}</div>
                <div className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</div>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  )
}
