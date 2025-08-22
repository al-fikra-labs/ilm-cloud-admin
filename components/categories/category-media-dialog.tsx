"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, User } from "lucide-react"
import { api, type Category, type Media, type Teacher } from "@/lib/api"

interface CategoryMediaDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryMediaDialog({ category, open, onOpenChange }: CategoryMediaDialogProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    if (!category || !category.mediaIds || category.mediaIds.length === 0) return

    try {
      setLoading(true)
      const [mediaData, teachersData] = await Promise.all([api.getMedia(), api.getTeachers()])

      // Filter media that belongs to this category
      const categoryMedia = mediaData.filter((m) => category.mediaIds.includes(m.id))
      setMedia(categoryMedia)
      setTeachers(teachersData)
    } catch (error) {
      console.error("Error fetching category media:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && category) {
      fetchData()
    }
  }, [open, category])

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
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Media in "{category?.name}"
            {category && <Badge variant="secondary">{category.mediaIds?.length || 0} items</Badge>}
          </DialogTitle>
        </DialogHeader>

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
          ) : !category?.mediaIds || category.mediaIds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No media assigned to this category yet.</div>
          ) : media.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Media items not found. They may have been deleted.
            </div>
          ) : (
            <div className="space-y-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
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
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
