"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "next-themes"
import { Footer } from "@/components/footer"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Textarea } from "@/components/ui/textarea"
import MarkdownIt from 'markdown-it'
import {
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Code,
  Quote,
  ListOrdered,
  Image as ImageIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react"

const md = new MarkdownIt()

interface EditorButtonProps {
  icon: React.ReactNode
  onClick: () => void
  label: string
  isActive?: boolean
  disabled?: boolean
}

function EditorButton({ icon, onClick, label, isActive, disabled }: EditorButtonProps) {
  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  )
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { theme } = useTheme()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [editorContent, setEditorContent] = useState("")
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [markdownContent, setMarkdownContent] = useState("")
  const [initialContent, setInitialContent] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Write your post content here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-2 bg-white dark:bg-[#09090B] text-black dark:text-white',
      },
    },
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getText())
      if (!isMarkdownMode) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = editor.getHTML()
        const text = tempDiv.textContent || tempDiv.innerText || ''
        setMarkdownContent(text)
      }
    },
  })

  useEffect(() => {
    fetchPost()
  }, [params.id])

  async function fetchPost() {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/posts/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }

      const post = await response.json()
      setTitle(post.title)
      setTags(post.tags)
      setCoverImage(post.coverImage || "")
      setInitialContent(post.content)
      
      if (editor) {
        editor.commands.setContent(post.content)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch post")
    }
  }

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  const handleImageUpload = async (file: File) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to upload images")
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8080/api/v1/images/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      editor?.chain().focus().setImage({ src: data.url }).run()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor && !isMarkdownMode) return

    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to update the post")
      }

      const content = isMarkdownMode ? md.render(markdownContent) : editor?.getHTML()

      const response = await fetch(`http://localhost:8080/api/v1/posts/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            tags,
            coverImage,
            published: true,
          }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update post")
      }

      toast({
        title: "Success",
        description: "Your post has been updated",
      })

      router.push(`/posts/${params.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container max-w-screen-lg py-6 lg:py-10">
          <div className="flex flex-col space-y-2 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit post</h1>
            <p className="text-muted-foreground">
              Make changes to your post
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="title"
                  name="title"
                  placeholder="Post title"
                  className="text-xl md:text-2xl font-bold tracking-tight placeholder:font-normal"
                  disabled={loading}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="Cover image URL (optional)"
                  type="url"
                  disabled={loading}
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-secondary px-2.5 py-1.5 rounded-md text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder="Add up to 4 tags (press Enter)"
                  disabled={loading || tags.length >= 4}
                  className="text-sm"
                />
              </div>
              <div className="rounded-lg border bg-card overflow-hidden">
                <div className="border-b px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {!isMarkdownMode && (
                        <>
                          <EditorButton
                            icon={<Undo className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            label="Undo"
                          />
                          <EditorButton
                            icon={<Redo className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            label="Redo"
                          />
                          <div className="w-px h-6 bg-border mx-1" />
                          <EditorButton
                            icon={<Bold className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            label="Bold"
                          />
                          <EditorButton
                            icon={<Italic className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            label="Italic"
                          />
                          <div className="w-px h-6 bg-border mx-1" />
                          <EditorButton
                            icon={<Heading1 className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive('heading', { level: 1 })}
                            label="Heading 1"
                          />
                          <EditorButton
                            icon={<Heading2 className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive('heading', { level: 2 })}
                            label="Heading 2"
                          />
                          <div className="w-px h-6 bg-border mx-1" />
                          <EditorButton
                            icon={<List className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            label="Bullet List"
                          />
                          <EditorButton
                            icon={<ListOrdered className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            label="Numbered List"
                          />
                          <div className="w-px h-6 bg-border mx-1" />
                          <EditorButton
                            icon={<AlignLeft className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            label="Align Left"
                          />
                          <EditorButton
                            icon={<AlignCenter className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            label="Align Center"
                          />
                          <EditorButton
                            icon={<AlignRight className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            label="Align Right"
                          />
                          <div className="w-px h-6 bg-border mx-1" />
                          <EditorButton
                            icon={<Code className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            isActive={editor.isActive('codeBlock')}
                            label="Code Block"
                          />
                          <EditorButton
                            icon={<Quote className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            label="Quote"
                          />
                          <EditorButton
                            icon={<Minus className="h-4 w-4" />}
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            label="Horizontal Rule"
                          />
                          <div className="w-px h-6 bg-border mx-1" />
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImageUpload(file)
                              }
                            }}
                          />
                          <EditorButton
                            icon={<ImageIcon className="h-4 w-4" />}
                            onClick={() => fileInputRef.current?.click()}
                            label="Add Image"
                            disabled={uploading}
                          />
                          <EditorButton
                            icon={<LinkIcon className="h-4 w-4" />}
                            onClick={() => {
                              const url = window.prompt('Enter URL')
                              if (url) {
                                editor.chain().focus().setLink({ href: url }).run()
                              }
                            }}
                            isActive={editor.isActive('link')}
                            label="Add Link"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {isMarkdownMode ? (
                  <Textarea
                    value={markdownContent}
                    onChange={(e) => {
                      const content = e.target.value
                      setMarkdownContent(content)
                      if (editor) {
                        const html = md.render(content)
                        editor.commands.setContent(html)
                      }
                    }}
                    className="w-full min-h-[500px] px-4 py-2 bg-white dark:bg-[#09090B] border-none focus-visible:ring-0 resize-none font-mono text-sm"
                    placeholder="Write your post content in markdown..."
                  />
                ) : (
                  <EditorContent editor={editor} />
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit"
                disabled={loading || !editorContent.trim() || !title.trim()} 
                className="w-full sm:w-auto"
              >
                {loading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                )}
                Update Post
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
} 