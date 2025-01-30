"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Post } from "@/lib/types"
import { postsApi } from "@/lib/api"
import { PostCard } from "@/components/post-card"
import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsApi.get(Number(id))
        setPost(response.data)
      } catch (error) {
        console.error('Error fetching post:', error)
      }
    }
    fetchPost()
  }, [id])

  if (!post) return null

  return (
    <div className="space-y-6">
      <PostCard post={post} />
      <Card className="p-6 prose dark:prose-invert max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </Card>
    </div>
  )
}