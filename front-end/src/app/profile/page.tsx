"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { Heart, Bookmark, Edit, Trash2 } from "lucide-react"

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
  email: string
  bio?: string
  profilePicture?: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    fetchUserProfile()
    fetchUserPosts()
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
    }
  }

  async function fetchUserPosts() {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        "http://localhost:8080/api/v1/posts/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()
      setPosts(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletePost(postId: number) {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${postId}`,
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

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
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
                  Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          </div>

          {user.bio && (
            <div className="mb-8">
              <p>{user.bio}</p>
            </div>
          )}

          <Tabs defaultValue="posts" className="w-full">
            <TabsList>
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't published any posts yet.{" "}
                  <Link href="/posts/new" className="text-primary hover:underline">
                    Write your first post
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
                        >
                          <Bookmark
                            className={`mr-1 h-4 w-4 ${
                              post.bookmarked ? "fill-current" : ""
                            }`}
                          />
                          {post.bookmarked ? "Saved" : "Save"}
                        </Button>
                        <div className="flex-1" />
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/posts/${post.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit post</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete post</span>
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="drafts" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                No drafts yet.
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
} 