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
import ImageUpload from "@/components/image-upload"

interface User {
  id: number        // Add this
  username: string
  name: string
  email: string
  bio?: string
  profilePicture?: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [profilePicture, setProfilePicture] = useState<string>("")

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
      if (!token) throw new Error("Token not found")

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
      setProfilePicture(data.profilePicture || "")

      console.log("Fetched user profile:", data)
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
      if (!token) throw new Error("Token not found")
      if (!user?.id) throw new Error("User ID not found")  // Add this check
  
      const formData = new FormData(event.currentTarget)
  
      const updatedUser = {
        name: formData.get("name"),
        email: formData.get("email"),
        bio: formData.get("bio"),
        profilePicture: profilePicture || user?.profilePicture || "",
      }
  
      console.log("Updating profile with:", updatedUser)
  
      // Update the endpoint to use the user's ID
      const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      })
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to update profile")
      }
  
      toast({
        title: "Success",
        description: "Your profile has been updated",
      })
  
      router.push(`/profile/${user?.username}`)
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
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Profile Picture
                </label>
                <ImageUpload
                  onImageUploaded={(imageUrl) => {
                    console.log("Uploaded image URL:", imageUrl)
                    setProfilePicture(imageUrl)
                  }}
                  defaultImage={user.profilePicture}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none">
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
                <label htmlFor="email" className="text-sm font-medium leading-none">
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
                <label htmlFor="bio" className="text-sm font-medium leading-none">
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
              <Button type="submit" disabled={saving}>
                {saving && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
