"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function WebsitePreview() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>Preview Original Website</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Batista Food & Grill Website</DialogTitle>
          <DialogDescription>Current website that will be regenerated with v0</DialogDescription>
        </DialogHeader>
        <div className="mt-4 border rounded-md overflow-hidden">
          <Image
            src="https://sjc.microlink.io/OvBcJKO66mkP5tY4F1Cbj56mbQsOAFcEvedoEnkIq3IWnRFlih_xKg4cMMnyN49VAlB9eEQj5qOp7lmAHfaB7g.jpeg"
            alt="Batista Food & Grill Website"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p className="font-medium">Website Issues:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Not fully responsive on mobile devices</li>
            <li>Dark overlay makes content difficult to read</li>
            <li>Missing meta descriptions and proper heading structure</li>
            <li>Navigation is basic and lacks modern design elements</li>
            <li>Limited content and information about the business</li>
            <li>Images are not optimized for web</li>
            <li>No clear call-to-action elements besides the Order Online button</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
