"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { postsApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarkdownEditor } from "@/components/markdown-editor"
import { TagInput } from "@/components/tag-input"
import { Card } from "@/components/ui/card"

export default function NewPost() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)

  const handleSubmit = async (publish: boolean) => {
    try {
      setIsPublishing(true)
      const response = await postsApi.create({
        title,
        content,
        tags,
        coverImage,
        published: publish
      })
      router.push(`/posts/${response.data.id}`)
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <Input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold"
      />
      
      <Input
        type="url"
        placeholder="Cover Image URL (optional)"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
      />
      
      <TagInput
        tags={tags}
        onChange={setTags}
        placeholder="Add up to 4 tags..."
      />
      
      <MarkdownEditor
        value={content}
        onChange={setContent}
        placeholder="Write your post content here... (Markdown is supported)"
      />
      
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isPublishing}
        >
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit(true)}
          disabled={isPublishing}
        >
          Publish
        </Button>
      </div>
    </Card>
  )
}