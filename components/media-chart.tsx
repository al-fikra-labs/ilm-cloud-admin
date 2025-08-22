"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { Media } from "@/lib/api"

interface MediaChartProps {
  media: Media[]
  loading?: boolean
}

export function MediaChart({ media, loading }: MediaChartProps) {
  const generateChartData = () => {
    const monthCounts: Record<string, number> = {}

    // Get last 6 months
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      monthCounts[monthKey] = 0
    }

    // Count media uploads by month
    media.forEach((item) => {
      const date = new Date(item.createdAt)
      const monthKey = date.toLocaleDateString("en-US", { month: "short" })
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++
      }
    })

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      uploads: count,
    }))
  }

  const chartData = generateChartData()
  const maxUploads = Math.max(...chartData.map((d) => d.uploads), 1)

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Media Uploads (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end justify-between gap-2 p-4">
            {chartData.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="text-sm font-medium">{item.uploads}</div>
                <div
                  className="bg-primary rounded-t-md w-full min-h-[4px] transition-all duration-500"
                  style={{
                    height: `${(item.uploads / maxUploads) * 200}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                <div className="text-xs text-muted-foreground">{item.month}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
