import React, { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ImagePlus, Trash2, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
  defaultImage?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, defaultImage }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(defaultImage)
  const { toast } = useToast()

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("http://localhost:8080/api/v1/images/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      const imageUrl = data.url

      setPreview(imageUrl)
      onImageUploaded(imageUrl)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(undefined)
    onImageUploaded("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        {preview ? (
          <div className="relative group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary">
              <img
                src={preview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span className="sr-only">Change Image</span>
                    </Button>
                  </label>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove Image</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/50">
              <ImagePlus className="h-10 w-10 text-primary/50" />
            </div>
          </div>
        )}

        {/* File input and label structure modified */}
        <div className="flex flex-col gap-2 items-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="w-full cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-4 w-4" />
                {preview ? "Change Profile Picture" : "Upload Profile Picture"}
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload