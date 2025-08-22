"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: number | null
  icon: LucideIcon
  loading?: boolean
  index: number
}

export function StatCard({ title, value, icon: Icon, loading, index }: StatCardProps) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-2" />
              ) : (
                <p
                  className="text-2xl font-bold mt-2 animate-in zoom-in duration-300"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                >
                  {value?.toLocaleString() ?? 0}
                </p>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
