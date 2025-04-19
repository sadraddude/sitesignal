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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">John Doe</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/profile" className="flex w-full items-center">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex w-full items-center">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/billing" className="flex w-full items-center">
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center">
                      <Image src="/logo-1.png" alt="WebInsight Pro Logo" width={40} height={40} className="mr-2" />
                      <span className="text-xl font-semibold text-gray-900">WebInsight Pro</span>
                    </Link>
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
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center px-2 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/avatar.png" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-base font-medium text-gray-700">John Doe</p>
                        <p className="text-sm text-gray-500">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Settings
                      </Link>
                      <Link
                        href="/billing"
                        className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Billing
                      </Link>
                      <button className="flex w-full items-center px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50">
                        <LogOut className="mr-2 h-5 w-5" />
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
