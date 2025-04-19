"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Wand2,
  Download,
  Share2,
  Copy,
  Check,
  Zap,
  Sparkles,
  Palette,
  Layout,
  Type,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BeforeAfterSlider } from "@/components/before-after-slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function RedesignPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mockupGenerated, setMockupGenerated] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState("tasty-bites")
  const [designStyle, setDesignStyle] = useState("modern-minimalist")
  const [colorScheme, setColorScheme] = useState("brand-colors")
  const [additionalInstructions, setAdditionalInstructions] = useState("")
  const [includeLogoRedesign, setIncludeLogoRedesign] = useState(false)
  const [includeMobile, setIncludeMobile] = useState(true)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      setMockupGenerated(true)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">AI Redesign Mockup Generator</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Configuration Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Mockup Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business">Select Business</Label>
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger id="business">
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tasty-bites">Tasty Bites Restaurant</SelectItem>
                  <SelectItem value="smith-plumbing">Smith & Sons Plumbing</SelectItem>
                  <SelectItem value="bright-smile">Bright Smile Dental</SelectItem>
                  <SelectItem value="green-thumb">Green Thumb Landscaping</SelectItem>
                  <SelectItem value="perfect-fit">Perfect Fit Gym</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Design Style</Label>
              <Select value={designStyle} onValueChange={setDesignStyle}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select design style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern-minimalist">Modern Minimalist</SelectItem>
                  <SelectItem value="bold-creative">Bold & Creative</SelectItem>
                  <SelectItem value="elegant-professional">Elegant Professional</SelectItem>
                  <SelectItem value="playful-friendly">Playful & Friendly</SelectItem>
                  <SelectItem value="luxury-premium">Luxury Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">Color Scheme</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger id="colors">
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand-colors">Use Brand Colors</SelectItem>
                  <SelectItem value="blue-professional">Blue Professional</SelectItem>
                  <SelectItem value="green-nature">Green Nature</SelectItem>
                  <SelectItem value="warm-friendly">Warm & Friendly</SelectItem>
                  <SelectItem value="bold-contrast">Bold Contrast</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Additional Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Add any specific requirements or elements to include..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="logo-redesign" className="cursor-pointer">
                  Include Logo Redesign
                </Label>
                <Switch id="logo-redesign" checked={includeLogoRedesign} onCheckedChange={setIncludeLogoRedesign} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="mobile-version" className="cursor-pointer">
                  Include Mobile Version
                </Label>
                <Switch id="mobile-version" checked={includeMobile} onCheckedChange={setIncludeMobile} />
              </div>
            </div>

            <Button className="w-full mt-6" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Redesign
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Redesign Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {!mockupGenerated ? (
              <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Mockup Generated Yet</h3>
                <p className="text-gray-500 max-w-md">
                  Configure your settings and click "Generate Redesign" to create a beautiful mockup for your client.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <Tabs defaultValue="before-after">
                  <TabsList className="w-full">
                    <TabsTrigger value="before-after">Before & After</TabsTrigger>
                    <TabsTrigger value="desktop">Desktop</TabsTrigger>
                    <TabsTrigger value="mobile">Mobile</TabsTrigger>
                    {includeLogoRedesign && <TabsTrigger value="logo">Logo</TabsTrigger>}
                  </TabsList>

                  <TabsContent value="before-after" className="pt-4">
                    <div className="rounded-lg overflow-hidden border">
                      <BeforeAfterSlider
                        beforeImage="/before-1.png"
                        afterImage="/after-1.png"
                        beforeLabel="Current Website"
                        afterLabel="AI Redesign"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="desktop" className="pt-4">
                    <div className="rounded-lg overflow-hidden border">
                      <Image
                        src="/after-1.png"
                        alt="Desktop Redesign"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="mobile" className="pt-4">
                    <div className="flex justify-center">
                      <div className="border-8 border-gray-800 rounded-3xl overflow-hidden w-[300px]">
                        <Image
                          src="/after-2.png"
                          alt="Mobile Redesign"
                          width={300}
                          height={600}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {includeLogoRedesign && (
                    <TabsContent value="logo" className="pt-4">
                      <div className="flex justify-center bg-gray-100 p-8 rounded-lg">
                        <Image
                          src="/logo-1.png"
                          alt="Logo Redesign"
                          width={300}
                          height={150}
                          className="w-auto h-auto"
                        />
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                <div className="space-y-4">
                  <h3 className="font-medium">Design Improvements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DesignImprovement
                      icon={<Layout className="h-5 w-5 text-purple-500" />}
                      title="Modern Layout"
                      description="Responsive grid-based layout with improved visual hierarchy"
                    />
                    <DesignImprovement
                      icon={<Palette className="h-5 w-5 text-purple-500" />}
                      title="Color Scheme"
                      description="Professional color palette that enhances brand recognition"
                    />
                    <DesignImprovement
                      icon={<Type className="h-5 w-5 text-purple-500" />}
                      title="Typography"
                      description="Modern, readable fonts with proper hierarchy and spacing"
                    />
                    <DesignImprovement
                      icon={<ImageIcon className="h-5 w-5 text-purple-500" />}
                      title="Imagery"
                      description="High-quality images with consistent style and treatment"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-end">
                  <CopyButton />
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button size="sm">
                    <Zap className="mr-2 h-4 w-4" />
                    Send to Client
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Design Explanation */}
      {mockupGenerated && (
        <Card>
          <CardHeader>
            <CardTitle>Design Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                The redesign for Tasty Bites Restaurant focuses on creating a modern, appetizing, and user-friendly
                experience that better showcases their food and ambiance. Here's what we improved:
              </p>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Responsive Design:</strong> The new website is fully responsive and works perfectly on all
                  devices, unlike the current site which has layout issues on mobile.
                </li>
                <li>
                  <strong>Visual Hierarchy:</strong> We've established a clear visual hierarchy that guides visitors to
                  key information like the menu, location, and online ordering.
                </li>
                <li>
                  <strong>Modern Aesthetics:</strong> The dated design elements have been replaced with a clean, modern
                  look that better represents the quality of their food.
                </li>
                <li>
                  <strong>Performance:</strong> The new design is optimized for fast loading, with properly sized images
                  and efficient code.
                </li>
                <li>
                  <strong>Call-to-Action:</strong> Clear, prominent buttons for online ordering and reservations make it
                  easy for customers to convert.
                </li>
                <li>
                  <strong>SEO Optimization:</strong> Proper heading structure, meta descriptions, and semantic HTML
                  improve search engine visibility.
                </li>
                <li>
                  <strong>Brand Consistency:</strong> The redesign maintains brand colors and identity while elevating
                  the overall presentation.
                </li>
              </ul>

              <p>
                This redesign addresses all the major issues with the current website while providing a fresh,
                contemporary look that will help Tasty Bites stand out from competitors and attract more customers.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Redesigns */}
      <Card>
        <CardHeader>
          <CardTitle>Previous Redesigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PreviousRedesignCard name="Green Thumb Landscaping" date="3 days ago" imageSrc="/before-after-demo.png" />
            <PreviousRedesignCard name="Perfect Fit Gym" date="1 week ago" imageSrc="/before-2.png" />
            <PreviousRedesignCard name="Bright Smile Dental" date="2 weeks ago" imageSrc="/before-3.png" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DesignImprovement({
  icon,
  title,
  description,
}: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function CopyButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </>
      )}
    </Button>
  )
}

function PreviousRedesignCard({ name, date, imageSrc }: { name: string; date: string; imageSrc: string }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative h-40">
        <Image src={imageSrc || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm">{name}</h3>
        <p className="text-xs text-muted-foreground">{date}</p>
        <div className="flex justify-end mt-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="#">View</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
