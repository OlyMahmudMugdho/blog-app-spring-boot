"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Post } from "@/lib/types"
import { postsApi } from "@/lib/api"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPosts = async (pageNum: number) => {
    if (!query) return
    
    try {
      setIsLoading(true)
      const response = await postsApi.search(query, pageNum)
      const newPosts = response.data.content
      setPosts(prev => pageNum === 0 ? newPosts : [...prev, ...newPosts])
      setHasMore(!response.data.last)
    } catch (error) {
      console.error('Error searching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
    fetchPosts(0)
  }, [query])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Search Posts</h1>
        <p className="text-muted-foreground">Enter a search term to find posts</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Search results for: {query}
      </h1>
      
      {posts.length === 0 && !isLoading ? (
        <p className="text-center py-12 text-muted-foreground">
          No posts found for "{query}"
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center">
              <Button
                onClick={loadMore}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}