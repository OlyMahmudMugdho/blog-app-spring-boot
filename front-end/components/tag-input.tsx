"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onChange, placeholder = "Add tags..." }: TagInputProps) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const newTag = input.trim().toLowerCase()
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag])
      }
      setInput("")
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md">
      {tags.map(tag => (
        <Badge key={tag} variant="secondary" className="gap-1">
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 border-0 focus-visible:ring-0"
      />
    </div>
  )
}