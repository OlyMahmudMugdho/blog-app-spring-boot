"use client"

import { useEffect, useState } from "react"
import { Post } from "@/lib/types"
import { postsApi } from "@/lib/api"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState<"latest" | "feed">("latest")
  const { user } = useAuth()

  const fetchPosts = async (tabType: "latest" | "feed", pageNum: number) => {
    try {
      const response = tabType === "feed" 
        ? await postsApi.getFeed(pageNum)
        : await postsApi.getAll(pageNum)
      
      const newPosts = response.data.content
      setPosts(prev => pageNum === 0 ? newPosts : [...prev, ...newPosts])
      setHasMore(!response.data.last)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  useEffect(() => {
    fetchPosts(activeTab, 0)
  }, [activeTab])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(activeTab, nextPage)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "latest" | "feed")}>
        <TabsList>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          {user && <TabsTrigger value="feed">My Feed</TabsTrigger>}
        </TabsList>
        <TabsContent value="latest" className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
        <TabsContent value="feed" className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
      </Tabs>
      
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}