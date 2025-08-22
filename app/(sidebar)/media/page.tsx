"use client"

import { useEffect, useState } from "react"
import { Plus, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-layout"
import { MediaTable } from "@/components/media/media-table"
import { MediaForm } from "@/components/media/media-form"
import { DeleteMediaDialog } from "@/components/media/delete-media-dialog"
import { api, Teacher, type Media } from "@/lib/api"

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const data = await api.getMedia()
      setMedia(data)
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleEdit = (media: Media) => {
    setSelectedMedia(media)
    setShowForm(true)
  }

  const handleDelete = (media: Media) => {
    setSelectedMedia(media)
    setShowDeleteDialog(true)
  }

  const handleFormSuccess = () => {
    fetchMedia()
    setSelectedMedia(null)
  }

  const handleDeleteSuccess = () => {
    fetchMedia()
    setSelectedMedia(null)
  }

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true)
        const data = await api.getTeachers()
        setTeachers(data)
      } catch (error) {
        console.error("Error fetching teachers:", error)
      } finally {
        setLoadingTeachers(false)
      }
    }
    fetchTeachers()

    // form.setValue("teacherId","3f9b6237-99d8-4fd1-b4e3-a8d5a4177b9d")
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Music className="h-8 w-8" />
            Media
          </h1>
          <p className="text-muted-foreground">Manage audio content and media files</p>
        </div>
        <Button
          onClick={() => {
            setSelectedMedia(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Media
        </Button>
      </div>

      {/* Media Table */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
        <MediaTable media={media} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Forms and Dialogs */}
      <MediaForm teachers={teachers} loadingTeachers={loadingTeachers} media={selectedMedia} open={showForm} onOpenChange={setShowForm} onSuccess={handleFormSuccess} />

      <DeleteMediaDialog
        media={selectedMedia}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
