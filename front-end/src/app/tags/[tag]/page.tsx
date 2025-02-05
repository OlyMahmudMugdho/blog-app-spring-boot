"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { Heart, Bookmark } from "lucide-react"
import { FormattedDate } from "@/components/formatted-date"

interface Post {
  id: number
  title: string
  content: string
  coverImage?: string
  author: {
    username: string
    name: string
    profilePicture?: string
  }
  tags: string[]
  createdAt: string
  likesCount: number
  liked: boolean
  bookmarked: boolean
}

export default function TagPage() {
  const params = useParams()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [params.tag])

  async function fetchPosts() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/tag/${params.tag}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()
      setPosts(Array.isArray(data) ? data : data.content || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  async function handleLike(postId: number) {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to like posts",
          variant: "destructive",
        })
        return
      }

      const post = posts.find((p) => p.id === postId)
      if (!post) return

      const method = post.liked ? "DELETE" : "POST"
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${postId}/like`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                liked: !p.liked,
                likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1,
              }
            : p
        )
      )
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to like post",
        variant: "destructive",
      })
    }
  }

  async function handleBookmark(postId: number) {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to bookmark posts",
          variant: "destructive",
        })
        return
      }

      const post = posts.find((p) => p.id === postId)
      if (!post) return

      const method = post.bookmarked ? "DELETE" : "POST"
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${postId}/bookmark`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to bookmark post")
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                bookmarked: !p.bookmarked,
              }
            : p
        )
      )

      toast({
        title: post.bookmarked ? "Removed from reading list" : "Added to reading list",
        description: post.bookmarked
          ? "Post has been removed from your reading list"
          : "Post has been added to your reading list",
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to bookmark post",
        variant: "destructive",
      })
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">#{params.tag}</h1>
              <p className="text-muted-foreground mt-1">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>

          {error ? (
            <div className="text-center py-8 text-muted-foreground">{error}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No posts found with this tag.{" "}
              <Link href="/" className="text-primary hover:underline">
                Browse all posts
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col space-y-4 bg-card p-6 rounded-lg shadow-sm"
                >
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={800}
                      height={400}
                      className="rounded-lg object-cover w-full aspect-video"
                    />
                  )}
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/profile/${post.author.username}`}
                      className="flex items-center space-x-2"
                    >
                      {post.author.profilePicture ? (
                        <Image
                          src={post.author.profilePicture}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <span className="text-lg font-semibold">
                            {post.author.name[0]}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                          <FormattedDate date={post.createdAt} />
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div>
                    <Link href={`/posts/${post.id}`} className="space-y-2">
                      <h2 className="text-2xl font-bold hover:text-primary">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className={`text-sm ${
                              tag === params.tag
                                ? "text-primary font-medium"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={post.liked ? "text-red-500" : ""}
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart
                        className={`mr-1 h-4 w-4 ${
                          post.liked ? "fill-current" : ""
                        }`}
                      />
                      {post.likesCount}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={post.bookmarked ? "text-primary" : ""}
                      onClick={() => handleBookmark(post.id)}
                    >
                      <Bookmark
                        className={`mr-1 h-4 w-4 ${
                          post.bookmarked ? "fill-current" : ""
                        }`}
                      />
                      {post.bookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link href={`/posts/${post.id}`}>
                        View Post
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 