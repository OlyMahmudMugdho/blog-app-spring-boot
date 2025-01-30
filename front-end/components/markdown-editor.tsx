"use client"

import { useCallback, useEffect } from "react"
import { Textarea } from "./ui/textarea"
import { Card } from "./ui/card"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  preview?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  preview = true
}: MarkdownEditorProps) {
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.indexOf("image") < 0) continue

      e.preventDefault()
      const file = item.getAsFile()
      if (!file) continue

      try {
        // Here you would typically upload the image to your server or a CDN
        // and get back a URL. For now, we'll just prevent the paste
        console.log('Image paste detected - implement upload functionality')
      } catch (error) {
        console.error('Error uploading pasted image:', error)
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [handlePaste])

  return (
    <div className="grid gap-4">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] font-mono"
      />
      {preview && value && (
        <Card className="p-4 prose dark:prose-invert max-w-none">
          <ReactMarkdown>{value}</ReactMarkdown>
        </Card>
      )}
    </div>
  )
}