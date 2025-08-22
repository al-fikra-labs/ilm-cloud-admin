"use client"

import { Music, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Media } from "@/lib/api"

interface RecentActivityProps {
  media: Media[]
  loading?: boolean
}

export function RecentActivity({ media, loading }: RecentActivityProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : media.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent media found</p>
          ) : (
            media.slice(0, 5).map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{item.teacher?.name || "Unknown Teacher"}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(item.duration)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
