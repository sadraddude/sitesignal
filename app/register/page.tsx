"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(step + 1)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Link href="/" className="text-2xl font-bold text-purple-700 mb-8">
        WebAnalyzer
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            {step === 1 && "Start your 14-day free trial. No credit card required."}
            {step === 2 && "Choose your subscription plan."}
            {step === 3 && "Your account has been created!"}
          </CardDescription>
        </CardHeader>

        {step === 1 && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long and include a number and special character.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name (Optional)</Label>
                <Input id="company" placeholder="Your Company" />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Account...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </CardContent>
        )}

        {step === 2 && (
          <CardContent className="space-y-4">
            <Tabs defaultValue="professional">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="starter">Starter</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="agency">Agency</TabsTrigger>
              </TabsList>

              <TabsContent value="starter" className="space-y-4 pt-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">
                    $49<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </h3>
                  <p className="text-muted-foreground">Perfect for freelancers</p>
                </div>

                <ul className="space-y-2">
                  <PlanFeature text="50 business searches per month" />
                  <PlanFeature text="Basic website analysis" />
                  <PlanFeature text="5 AI redesigns per month" />
                  <PlanFeature text="Email support" />
                </ul>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4 pt-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">
                    $99<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </h3>
                  <p className="text-muted-foreground">Ideal for growing agencies</p>
                </div>

                <ul className="space-y-2">
                  <PlanFeature text="200 business searches per month" />
                  <PlanFeature text="Advanced website analysis" />
                  <PlanFeature text="25 AI redesigns per month" />
                  <PlanFeature text="Priority email support" />
                  <PlanFeature text="Export and reporting features" />
                </ul>
              </TabsContent>

              <TabsContent value="agency" className="space-y-4 pt-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">
                    $199<span className="text-sm font-normal text-muted-foreground">/month</span>
                  </h3>
                  <p className="text-muted-foreground">For established agencies</p>
                </div>

                <ul className="space-y-2">
                  <PlanFeature text="Unlimited business searches" />
                  <PlanFeature text="Comprehensive website analysis" />
                  <PlanFeature text="100 AI redesigns per month" />
                  <PlanFeature text="Priority phone & email support" />
                  <PlanFeature text="White-label reports" />
                  <PlanFeature text="Team collaboration features" />
                </ul>
              </TabsContent>
            </Tabs>

            <Button onClick={() => setStep(3)} className="w-full">
              Start 14-Day Free Trial
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        )}

        {step === 3 && (
          <CardContent className="space-y-6 py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium">Account Created Successfully!</h3>
              <p className="text-muted-foreground mt-2">
                Your 14-day free trial has started. No credit card required until your trial ends.
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        )}

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      <span>{text}</span>
    </li>
  )
}
