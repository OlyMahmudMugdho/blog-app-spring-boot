"use client"

import { useState } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Footer } from "@/components/footer"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email")
      }

      setEmailSent(true)
      toast({
        title: "Success",
        description: "Password reset instructions have been sent to your email",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset your password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {emailSent ? (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Check your email for password reset instructions. The link will expire in 15 minutes.
                  </AlertDescription>
                </Alert>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/login">Back to login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button disabled={loading} className="w-full">
                    {loading && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    )}
                    Send Reset Instructions
                  </Button>
                </div>
              </form>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button variant="outline" asChild className="w-full">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 