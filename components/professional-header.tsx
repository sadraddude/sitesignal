"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BarChart2, Search, Settings, HelpCircle, Bell, ChevronDown, Menu, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserButton } from "@clerk/nextjs"

export function ProfessionalHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Image src="/logo-1.png" alt="WebInsight Pro Logo" width={40} height={40} className="mr-2" />
              <span className="hidden text-xl font-semibold text-gray-900 sm:block">WebInsight Pro</span>
            </Link>
            <nav className="ml-10 hidden space-x-8 md:flex">
              <Link
                href="/dashboard"
                className="flex items-center px-1 py-2 text-sm font-medium text-gray-900 hover:text-primary-600"
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/website-analyzer"
                className="flex items-center px-1 py-2 text-sm font-medium text-gray-500 hover:text-primary-600"
              >
                <Search className="mr-2 h-4 w-4" />
                Website Analyzer
              </Link>
            </nav>
          </div>

          {/* Desktop right navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Settings className="h-5 w-5" />
            </Button>

            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 py-6">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <Link href="/dashboard" className="flex items-center">
                      <Image src="/logo-1.png" alt="WebInsight Pro Logo" width={30} height={30} className="mr-2" />
                      <span className="text-lg font-semibold text-gray-900">WebInsight Pro</span>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-2 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                    >
                      <BarChart2 className="mr-4 h-5 w-5 text-gray-500" />
                      Dashboard
                    </Link>
                    <Link
                      href="/website-analyzer"
                      className="flex items-center px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <Search className="mr-4 h-5 w-5 text-gray-500" />
                      Website Analyzer
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
