"use client"

import { useEffect, useState } from "react"
import { Plus, ListMusic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-layout"
import { PlaylistsTable } from "@/components/playlists/playlists-table"
import { PlaylistForm } from "@/components/playlists/playlist-form"
import { DeletePlaylistDialog } from "@/components/playlists/delete-playlist-dialog"
import { PlaylistMediaDialog } from "@/components/playlists/playlist-media-dialog"
import { api, Media, type Playlist } from "@/lib/api"
import Link from "next/link"

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [media, setMedia] = useState<Media[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const data = await api.getPlaylists()
      setPlaylists(data)
    } catch (error) {
      console.error("Error fetching playlists:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const handleEdit = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setShowForm(true)
  }

  const handleDelete = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setShowDeleteDialog(true)
  }

  const handleFormSuccess = () => {
    fetchPlaylists()
    setSelectedPlaylist(null)
  }

  const handleDeleteSuccess = () => {
    fetchPlaylists()
    setSelectedPlaylist(null)
  }

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoadingMedia(true)
        const data = await api.getMedia(1, 30) // page, limit
        setMedia(data.filter((item) => item.isActive))
      } catch (error) {
        console.error("Error fetching media:", error)
      } finally {
        setLoadingMedia(false)
      }
    }
    fetchMedia()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ListMusic className="h-8 w-8" />
            Playlists
          </h1>
          <p className="text-muted-foreground">Manage audio playlists and media collections</p>
        </div>
        <Button className="cursor-pointer"
          asChild>
          <Link href={`/playlists/manage-playlist`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Playlist
          </Link>
        </Button>
      </div>

      {/* Playlists Table */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
        <PlaylistsTable
          playlists={playlists}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Forms and Dialogs */}
      <PlaylistForm
        playlist={selectedPlaylist}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
        media={media}
        loadingMedia={loadingMedia}
      />

      <DeletePlaylistDialog
        playlist={selectedPlaylist}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
