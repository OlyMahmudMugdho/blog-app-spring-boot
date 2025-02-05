"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Footer } from "@/components/footer"

export default function ResetPasswordPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1">
          <div className="container flex h-[calc(100vh-4rem)] w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <Alert variant="destructive">
                <AlertDescription>
                  Invalid or missing reset token. Please request a new password reset link.
                </AlertDescription>
              </Alert>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/forgot-password">Request New Link</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      toast({
        title: "Success",
        description: "Your password has been reset successfully",
      })

      router.push("/auth/login")
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
                Enter your new password below
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    id="password"
                    name="password"
                    placeholder="New Password"
                    type="password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    type="password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <Button disabled={loading} className="w-full">
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  )}
                  Reset Password
                </Button>
              </div>
            </form>

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