"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
)

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const coverImage = formData.get("coverImage") as string

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to create a post")
      }

      const response = await fetch("http://localhost:8080/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags,
          coverImage,
          published: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post")
      }

      toast({
        title: "Success",
        description: "Your post has been created",
      })

      router.push("/")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col space-y-2 mb-6">
            <h1 className="text-3xl font-bold">Create a new post</h1>
            <p className="text-muted-foreground">
              Share your thoughts with the community
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                id="title"
                name="title"
                placeholder="Post title"
                className="text-lg"
                disabled={loading}
                required
              />
              <Input
                id="coverImage"
                name="coverImage"
                placeholder="Cover image URL (optional)"
                type="url"
                disabled={loading}
              />
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Add tags (press Enter)"
                  disabled={loading}
                />
              </div>
              <div data-color-mode="light">
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || "")}
                  preview="edit"
                  height={400}
                />
              </div>
            </div>
            <Button disabled={loading || !content.trim()}>
              {loading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
              )}
              Publish Post
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
} 