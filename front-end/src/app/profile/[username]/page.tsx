"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { Heart, Bookmark } from "lucide-react"
import { FormattedDate } from "@/components/formatted-date"

interface Post {
  id: number
  title: string
  content: string
  coverImage?: string
  tags: string[]
  createdAt: string
  likesCount: number
  liked: boolean
  bookmarked: boolean
}

interface User {
  username: string
  name: string
  bio?: string
  profilePicture?: string
  createdAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchUserProfile()
    fetchUserPosts()
  }, [params.username])

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${params.username}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      console.log('User data from API:', data)
      setUser(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load profile")
    }
  }

  async function fetchUserPosts() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/user/${params.username}`,
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
      setPosts([])
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

  if (error || !user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <MainNav />
        <main className="flex-1 container py-6">
          <div className="text-center py-8 text-muted-foreground">
            {error || "User not found"}
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
          <div className="flex items-center space-x-4 mb-8">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-3xl font-semibold">
                  {user.name[0]}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">
                <FormattedDate date={user.createdAt} prefix="Joined" />
              </p>
            </div>
          </div>

          {user.bio && (
            <div className="mb-8">
              <p>{user.bio}</p>
            </div>
          )}

          <Tabs defaultValue="posts" className="w-full">
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No posts yet
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
} 