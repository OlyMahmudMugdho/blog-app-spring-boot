"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { formatDistanceToNow } from "date-fns"
import { Heart, Bookmark, Edit, Trash2, MoreVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { FormattedDate } from "@/components/formatted-date"
import { Footer } from "@/components/footer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
)

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

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [theme, setTheme] = useState("light")
  const [isAuthor, setIsAuthor] = useState(false)

  useEffect(() => {
    fetchPost()
    checkIfAuthor()
  }, [params.id])

  async function checkIfAuthor() {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsAuthor(false)
        return
      }

      const response = await fetch("http://localhost:8080/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const currentUser = await response.json()
        const postResponse = await fetch(
          `http://localhost:8080/api/v1/posts/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
        if (postResponse.ok) {
          const postData = await postResponse.json()
          setIsAuthor(currentUser.username === postData.author.username)
        }
      }
    } catch (error) {
      console.error("Failed to check post ownership:", error)
    }
  }

  async function fetchPost() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${params.id}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }

      const data = await response.json()
      setPost(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleLike() {
    if (!post) return

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

      const method = post.liked ? "DELETE" : "POST"
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${post.id}/like`,
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

      setPost((prev) =>
        prev
          ? {
              ...prev,
              liked: !prev.liked,
              likesCount: prev.liked ? prev.likesCount - 1 : prev.likesCount + 1,
            }
          : null
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

  async function handleBookmark() {
    if (!post) return

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

      const method = post.bookmarked ? "DELETE" : "POST"
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${post.id}/bookmark`,
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

      setPost((prev) =>
        prev
          ? {
              ...prev,
              bookmarked: !prev.bookmarked,
            }
          : null
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

  async function handleDeletePost() {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to delete posts",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${params.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      toast({
        title: "Success",
        description: "Post deleted successfully",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete post",
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

  if (error || !post) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-6">
          <div className="text-center py-8 text-muted-foreground">
            {error || "Post not found"}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 container py-6">
        <article className="max-w-3xl mx-auto">
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="rounded-lg object-cover w-full aspect-video mb-8"
            />
          )}
          <div className="flex items-center justify-between mb-8">
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
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <div className="prose dark:prose-invert max-w-none mb-8">
            <div data-color-mode={theme === "dark" ? "dark" : "light"}>
              <MarkdownPreview source={post.content} />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={post.liked ? "text-red-500" : ""}
              onClick={handleLike}
            >
              <Heart
                className={`mr-1 h-4 w-4 ${post.liked ? "fill-current" : ""}`}
              />
              {post.likesCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={post.bookmarked ? "text-primary" : ""}
              onClick={handleBookmark}
            >
              <Bookmark
                className={`mr-1 h-4 w-4 ${
                  post.bookmarked ? "fill-current" : ""
                }`}
              />
              {post.bookmarked ? "Saved" : "Save"}
            </Button>
            {isAuthor && (
              <>
                <div className="flex-1" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/posts/${params.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Post
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeletePost}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
} 