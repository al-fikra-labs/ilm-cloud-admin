"use client"

import type React from "react"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Music,
  ListMusic,
  FolderOpen,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Headphones,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useTheme } from "@/components/theme-context"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: false },
  { icon: Users, label: "Users", href: "/users", active: false },
  { icon: GraduationCap, label: "Teachers", href: "/teachers", active: false },
  { icon: Music, label: "Media", href: "/media", active: false },
  { icon: ListMusic, label: "Playlists", href: "/playlists", active: false },
  { icon: FolderOpen, label: "Categories", href: "/categories", active: false },
  { icon: Settings, label: "Settings", href: "/settings", active: false },
]

interface AdminLayoutProps {
  children: React.ReactNode
  admin: {
    name: string,
    email: string
  }
}

export function AdminLayout({ children, admin }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const pathname = usePathname()
  const router = useRouter()
  const updatedSidebarItems = sidebarItems

  const logout = () => {
    Cookies.remove('token')
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:flex lg:flex-col",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Headphones className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold font-heading text-sidebar-foreground">SoundAdmin</h1>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {updatedSidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 group",
                    (item.href === "/" ? item.href === pathname : pathname.includes(item.href))
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    (item.href == "/" ? item.href == pathname : pathname.includes(item.href)) ? "scale-110" : "group-hover:scale-105",
                  )}
                />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60 text-center">Your Audio Universe Awaits</div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0 max-h-screen">
        {/* Top navbar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-6">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search your audio universe..."
                  className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Bell className="h-5 w-5" />
              </Button>

              {/* Profile menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      {/* <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" /> */}
                      <AvatarFallback className="bg-primary text-primary-foreground">{admin.name.split("")[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{admin.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{admin.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button className="w-full cursor-pointer" onClick={logout}>
                      Log out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-6 py-6 overflow-auto bg-gradient-to-br from-background to-muted/20">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
