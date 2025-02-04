"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { Footer } from "@/components/footer"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
)

const MDPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
)

interface Post {
  id: number
  title: string
  content: string
  coverImage?: string
  tags: string[]
  published: boolean
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { theme } = useTheme()
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    fetchPost()
  }, [params.id, router])

  async function fetchPost() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }

      const data = await response.json()
      setPost(data)
      setTitle(data.title)
      setContent(data.content)
      setTags(data.tags)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load post")
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const coverImage = formData.get("coverImage") as string

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to edit a post")
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${params.id}`,
        {
          method: "PUT",
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
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update post")
      }

      toast({
        title: "Success",
        description: "Your post has been updated",
      })

      router.push(`/posts/${params.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update post")
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

  if (error || !post) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-6">
          <div className="text-center py-8 text-muted-foreground">
            {error || "Failed to load post"}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container max-w-screen-lg py-6 lg:py-10">
          <div className="flex flex-col space-y-2 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit post</h1>
            <p className="text-muted-foreground">
              Make changes to your post
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="title"
                  name="title"
                  placeholder="Post title"
                  className="text-xl md:text-2xl font-bold tracking-tight placeholder:font-normal"
                  disabled={saving}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="Cover image URL (optional)"
                  type="url"
                  disabled={saving}
                  defaultValue={post.coverImage}
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-secondary px-2.5 py-1.5 rounded-md text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
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
                  placeholder="Add up to 4 tags (press Enter)"
                  disabled={saving || tags.length >= 4}
                  className="text-sm"
                />
              </div>
              <div className="rounded-lg border bg-card">
                <Tabs defaultValue="write" className="w-full">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <div className="text-sm text-muted-foreground">
                      {content.length} characters
                    </div>
                  </div>
                  <TabsContent value="write" className="p-0">
                    <div data-color-mode={theme === "dark" ? "dark" : "light"}>
                      <MDEditor
                        value={content}
                        onChange={(value) => setContent(value || "")}
                        preview="edit"
                        height={500}
                        className="w-full border-none !bg-transparent"
                        hideToolbar={true}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="preview" className="p-4">
                    <div data-color-mode={theme === "dark" ? "dark" : "light"}>
                      <article className="prose dark:prose-invert max-w-none">
                        <MDPreview source={content || "Nothing to preview"} />
                      </article>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => router.push(`/posts/${params.id}`)}
              >
                Cancel
              </Button>
              <Button 
                disabled={saving || !content.trim() || !title.trim()}
              >
                {saving && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                )}
                Update Post
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
} 