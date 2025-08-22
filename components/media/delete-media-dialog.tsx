"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api, type Media } from "@/lib/api"

interface DeleteMediaDialogProps {
  media: Media | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteMediaDialog({ media, open, onOpenChange, onSuccess }: DeleteMediaDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!media) return

    try {
      setLoading(true)
      await api.deleteMedia(media.id)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting media:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{media?.name}</strong>? This action cannot be undone and may affect
            playlists and categories that reference this media.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Media"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
