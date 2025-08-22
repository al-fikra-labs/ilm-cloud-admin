"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Search, User } from "lucide-react"
import { api, type Playlist, type Media, type Teacher } from "@/lib/api"
import { Input } from "../ui/input"

interface PlaylistMediaDialogProps {
  playlist: Playlist | null
  open: boolean
  onOpenChange: (open: boolean) => void
  media: Media[]
  loadingMedia: boolean
  setMediaSearch: (search: string) => void
  mediaSearch: string
}

export function PlaylistMediaDialog({ playlist, open, onOpenChange, media, loadingMedia, setMediaSearch, mediaSearch }: PlaylistMediaDialogProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const fetchData = async () => {
    // if (!playlist || !playlist.mediaIds || playlist.mediaIds.length === 0) return

    // try {
    //   setLoading(true)
    //   const [mediaData, teachersData] = await Promise.all([api.getMedia(), api.getTeachers()])

    //   // Filter media that belongs to this playlist
    //   const playlistMedia = mediaData.filter((m) => playlist.mediaIds.includes(m.id))
    //   setMedia(playlistMedia)
    //   setTeachers(teachersData)
    // } catch (error) {
    //   console.error("Error fetching playlist media:", error)
    // } finally {
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    if (open && playlist) {
      fetchData()
    }
  }, [open, playlist])

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher?.name || "Unknown Teacher"
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Media in "{playlist?.name}"
            {playlist && <Badge variant="secondary">{playlist.mediaIds?.length || 0} items</Badge>}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex-1 w-full  ">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search medias..."
                value={mediaSearch}
                onChange={(e) => {
                  setMediaSearch(e.target.value)
                }}
                className="pl-10"
              />
            </div>
            <div className="max-h-[65vh] py-2 flex flex-col gap-2 overflow-y-auto w-full">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      {item.isActive ? (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {getTeacherName(item.teacherId)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(item.duration)}
                      </div>
                      <span>Added {formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
            // ) : !playlist?.mediaIds || playlist.mediaIds.length === 0 ? (
            //   <div className="text-center py-8 text-muted-foreground">No media assigned to this playlist yet.</div>
            // ) : media.length === 0 ? (
            //   <div className="text-center py-8 text-muted-foreground">
            //     Media items not found. They may have been deleted.
            //   </div>
          ) : (
            <div className="space-y-4">

            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
