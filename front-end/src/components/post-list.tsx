"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Heart, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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

export function PostList() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        "http://localhost:8080/api/v1/posts?page=0&size=10&sort=createdAt,desc",
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
      setPosts(data.content)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
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
      <div className="flex justify-center items-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">{error}</div>
    )
  }

  return (
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
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
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
                    className="text-sm text-muted-foreground hover:text-primary"
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
          </div>
        </article>
      ))}
    </div>
  )
} 