"use client"

import { Post } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Bookmark } from "lucide-react"
import Link from "next/link"
import { postsApi } from "@/lib/api"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: Post
  onLike?: (postId: number) => void
  onBookmark?: (postId: number) => void
}

export function PostCard({ post, onLike, onBookmark }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarked)

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postsApi.unlike(post.id)
        setLikeCount(prev => prev - 1)
      } else {
        await postsApi.like(post.id)
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
      onLike?.(post.id)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await postsApi.unbookmark(post.id)
      } else {
        await postsApi.bookmark(post.id)
      }
      setIsBookmarked(!isBookmarked)
      onBookmark?.(post.id)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  return (
    <Card>
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.profilePicture} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/users/${post.author.username}`} className="font-medium hover:text-primary">
              {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="mt-4">
          <Link href={`/posts/${post.id}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Heart
              className={cn("h-4 w-4", isLiked && "fill-current text-red-500")}
            />
            <span>{likeCount}</span>
          </button>
          <Link
            href={`/posts/${post.id}#comments`}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments}</span>
          </Link>
          <button
            onClick={handleBookmark}
            className="flex items-center space-x-1 hover:text-primary"
          >
            <Bookmark
              className={cn("h-4 w-4", isBookmarked && "fill-current")}
            />
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}