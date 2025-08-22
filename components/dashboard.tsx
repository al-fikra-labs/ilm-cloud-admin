"use client"

import { useEffect, useState } from "react"
import { Users, GraduationCap, Music, ListMusic, FolderOpen } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { MediaChart } from "@/components/media-chart"
import { api, type User, type Teacher, type Media, type Playlist, type Category } from "@/lib/api"

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [usersData, teachersData, mediaData, playlistsData, categoriesData] = await Promise.all([
          api.getUsers().catch(() => []),
          api.getTeachers().catch(() => []),
          api.getMedia().catch(() => []),
          api.getPlaylists().catch(() => []),
          api.getCategories().catch(() => []),
        ])

        setUsers(usersData)
        setTeachers(teachersData)
        setMedia(mediaData)
        setPlaylists(playlistsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Sort media by creation date for recent activity
  const recentMedia = [...media].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-heading tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Audio Universe Awaits
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Craft, manage, and curate your audio courses with ease. Welcome to your creative command center.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Users" value={users.length} icon={Users} loading={loading} index={0} />
        <StatCard title="Total Teachers" value={teachers.length} icon={GraduationCap} loading={loading} index={1} />
        <StatCard title="Total Media" value={media.length} icon={Music} loading={loading} index={2} />
        <StatCard title="Total Playlists" value={playlists.length} icon={ListMusic} loading={loading} index={3} />
        <StatCard title="Total Categories" value={categories.length} icon={FolderOpen} loading={loading} index={4} />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        <RecentActivity media={recentMedia} loading={loading} />
        <MediaChart media={media} loading={loading} />
      </div>
    </div>
  )
}
