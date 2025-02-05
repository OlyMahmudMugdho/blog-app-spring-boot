"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"

interface Tag {
  name: string
  postCount: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTags()
  }, [])

  async function fetchTags() {
    try {
      const response = await fetch("http://localhost:8080/api/v1/posts/tags")
      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }

      const data = await response.json()
      setTags(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load tags")
    } finally {
      setLoading(false)
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

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col space-y-2 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
            <p className="text-muted-foreground">
              Browse posts by topic
            </p>
          </div>

          {error ? (
            <div className="text-center py-8 text-muted-foreground">{error}</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tags found
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="group relative rounded-lg border p-6 hover:bg-muted transition-colors"
                >
                  <h3 className="font-semibold">#{tag.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {tag.postCount} {tag.postCount === 1 ? "post" : "posts"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 