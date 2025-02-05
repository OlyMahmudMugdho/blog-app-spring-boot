"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FormattedDate } from "@/components/formatted-date"
import { MessageCircle, Edit2, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Comment {
  id: number
  content: string
  user: {
    username: string
    name: string
    profilePicture?: string
  }
  createdAt: string
}

interface CommentsProps {
  postId: number
}

export function Comments({ postId }: CommentsProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [user, setUser] = useState<{ username: string; name: string } | null>(null)
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchComments()
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      }
    }
  }

  async function fetchComments() {
    try {
      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {}
      
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/comments/post/${postId}?sort=createdAt,desc`,
        { headers }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }

      const data = await response.json()
      setComments(data.content || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!content.trim()) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast({
          title: "Error",
          description: "You must be logged in to comment",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/comments/post/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, postId }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to create comment")
      }

      const newComment = await response.json()
      setComments((prev) => [newComment, ...prev])
      setContent("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(commentId: number) {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(
        `http://localhost:8080/api/v1/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update comment")
      }

      const updatedComment = await response.json()
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updatedComment : c))
      )
      setEditingId(null)
      setEditContent("")
      toast({
        title: "Success",
        description: "Comment updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(commentId: number) {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(
        `http://localhost:8080/api/v1/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      })
    } finally {
      setCommentToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comments</h2>
        <span className="text-muted-foreground">({comments.length})</span>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            required
          />
          <Button disabled={submitting || !content.trim()}>
            {submitting && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            )}
            Post Comment
          </Button>
        </form>
      ) : (
        <div className="text-center py-4 bg-muted rounded-lg">
          <p className="text-muted-foreground">
            Please{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              log in
            </Link>{" "}
            to comment
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Link
              href={`/profile/${comment.user.username}`}
              className="flex-shrink-0"
            >
              {comment.user.profilePicture ? (
                <Image
                  src={comment.user.profilePicture}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {comment.user.name[0]}
                  </span>
                </div>
              )}
            </Link>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/profile/${comment.user.username}`}
                    className="font-medium hover:underline"
                  >
                    {comment.user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    <FormattedDate date={comment.createdAt} />
                  </p>
                </div>
                {user?.username === comment.user.username && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(comment.id)
                        setEditContent(comment.content)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit comment</span>
                    </Button>
                    <AlertDialog open={commentToDelete === comment.id} onOpenChange={(open) => !open && setCommentToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCommentToDelete(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete comment</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your comment.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(comment.id)}
                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              {editingId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setEditContent("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleEdit(comment.id)}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 