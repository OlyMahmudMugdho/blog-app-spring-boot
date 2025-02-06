"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Footer } from "@/components/footer"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  username: string
  name: string
  email: string
  bio?: string
  profilePicture?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    fetchUserProfile()
  }, [router])

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setUser(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData(event.currentTarget)
      const updatedUser = {
        name: formData.get("name"),
        email: formData.get("email"),
        bio: formData.get("bio"),
        profilePicture: formData.get("profilePicture"),
      }

      const response = await fetch("http://localhost:8080/api/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Your profile has been updated",
      })

      router.push("/profile")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-6">
          <div className="flex justify-center items-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-6">
          <div className="text-center py-8 text-muted-foreground">
            {error || "Failed to load profile"}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
              <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-4">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="profilePicture"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Profile Picture URL
                    </label>
                    <Input
                      id="profilePicture"
                      name="profilePicture"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      defaultValue={user.profilePicture}
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      defaultValue={user.name}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      defaultValue={user.email}
                      disabled={saving}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="bio"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      defaultValue={user.bio}
                      disabled={saving}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => router.push("/profile")}
                  >
                    Cancel
                  </Button>
                  <Button disabled={saving}>
                    {saving && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="account" className="mt-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permanently delete your account and all of your content.
                  </p>
                  <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        // Implement account deletion
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
} 