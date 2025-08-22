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
import { api, type Playlist } from "@/lib/api"

interface DeletePlaylistDialogProps {
  playlist: Playlist | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeletePlaylistDialog({ playlist, open, onOpenChange, onSuccess }: DeletePlaylistDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!playlist) return

    try {
      setLoading(true)
      await api.deletePlaylist(playlist.id)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting playlist:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Playlist</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{playlist?.name}</strong>? This action cannot be undone and will
            remove the playlist containing {playlist?.mediaIds?.length || 0} media items.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
