"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api, type Category, type Media } from "@/lib/api"

interface CategoryFormProps {
  category?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CategoryForm({ category, open, onOpenChange, onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const [media, setMedia] = useState<Media[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    nameML: "",
    description: "",
    mediaIds: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEditing = !!category

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        nameML: category.nameML || "",
        description: category.description || "",
        mediaIds: category.mediaIds || [],
      })
    } else {
      setFormData({
        name: "",
        nameML: "",
        description: "",
        mediaIds: [],
      })
    }
  }, [category])

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoadingMedia(true)
        const data = await api.getMedia()
        setMedia(data.filter((item) => item.isActive))
      } catch (error) {
        console.error("Error fetching media:", error)
      } finally {
        setLoadingMedia(false)
      }
    }

    if (open) {
      fetchMedia()
    }
  }, [open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.mediaIds || formData.mediaIds.length === 0) {
      newErrors.mediaIds = "At least one media item must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      if (isEditing) {
        await api.updateCategory(category.id, formData)
      } else {
        await api.createCategory(formData)
      }
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: "",
        nameML: "",
        description: "",
        mediaIds: [],
      })
      setErrors({})
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMediaToggle = (mediaId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, mediaIds: [...formData.mediaIds, mediaId] })
    } else {
      setFormData({ ...formData, mediaIds: formData.mediaIds.filter((id) => id !== mediaId) })
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Create New Category"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update category information and media selection."
              : "Create a new category with selected media items."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (EN)</Label>
              <Input
                id="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameML">Name (ML)</Label>
              <Input
                id="nameML"
                placeholder="Enter Malayalam name"
                value={formData.nameML}
                onChange={(e) => setFormData({ ...formData, nameML: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter category description (optional)"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Media Items</Label>
            <div className="rounded-md border">
              <ScrollArea className="h-[300px] p-4">
                {loadingMedia ? (
                  <div className="text-center py-8 text-muted-foreground">Loading media...</div>
                ) : media.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No active media found</div>
                ) : (
                  <div className="space-y-3">
                    {media.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                        <Checkbox
                          checked={formData.mediaIds.includes(item.id)}
                          onCheckedChange={(checked) => handleMediaToggle(item.id, checked as boolean)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.name}</div>
                          {item.nameML && <div className="text-sm text-muted-foreground">{item.nameML}</div>}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{item.teacher?.name || "Unknown Teacher"}</span>
                            <span>•</span>
                            <span>{formatDuration(item.duration)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            <div className="text-sm text-muted-foreground">
              {formData.mediaIds?.length || 0} media item{(formData.mediaIds?.length || 0) !== 1 ? "s" : ""} selected
            </div>
            {errors.mediaIds && <p className="text-sm text-red-500">{errors.mediaIds}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
