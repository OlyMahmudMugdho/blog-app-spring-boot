"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Heart, Bookmark } from "lucide-react"

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
  id: number
  username: string
  name: string
  bio?: string
  profilePicture?: string
  createdAt: string
  followersCount: number
  followingCount: number
  isFollowing: boolean
}

export default function UserProfilePage() {
  const params = useParams()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    fetchUserProfile()
    fetchUserPosts()
    checkIfOwnProfile()
  }, [params.username])

  async function checkIfOwnProfile() {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsOwnProfile(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const currentUser = await response.json()
        setIsOwnProfile(currentUser.username === params.username)
      }
    } catch (error) {
      console.error("Failed to check profile ownership:", error)
    }
  }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleDeletePost(postId: number) {
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
        description:
          error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  async function handleFollow() {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to follow users",
          variant: "destructive",
        })
        return
      }

      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        })
        return
      }

      const method = user.isFollowing ? "DELETE" : "POST"
      const response = await fetch(
        `http://localhost:8080/api/v1/users/${user.id}/${user.isFollowing ? "unfollow" : "follow"}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to ${user.isFollowing ? "unfollow" : "follow"} user`)
      }

      // Update the user state with the new follow status
      setUser(prevUser => {
        if (!prevUser) return null
        return {
          ...prevUser,
          isFollowing: !prevUser.isFollowing,
          followersCount: prevUser.isFollowing 
            ? prevUser.followersCount - 1 
            : prevUser.followersCount + 1
        }
      })

      toast({
        title: "Success",
        description: `Successfully ${user.isFollowing ? "unfollowed" : "followed"} ${user.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update follow status",
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
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
            <div className="flex items-center space-x-4">
            {user.profilePicture ? (
  <div className="relative w-20 h-20">
    <Image
      src={user.profilePicture}
      alt={user.name}
      fill
      className="rounded-full object-cover"
    />
  </div>
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
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  
                  <p>{user.followersCount} followers</p>
                  <p>{user.followingCount} following</p>
                </div>
              </div>
            </div>
            {isOwnProfile ? (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            ) : (
              <Button
                onClick={handleFollow}
                variant={user.isFollowing ? "destructive" : "default"}
                className="w-full sm:w-auto"
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>

          {user.bio && (
            <div className="mb-8">
              <p>{user.bio}</p>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
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
                      <div className="relative w-full aspect-[16/9] max-h-[300px] overflow-hidden rounded-lg">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
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
        </div>
      </main>
    </div>
  )
}