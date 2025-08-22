"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api, type Playlist, type Media } from "@/lib/api"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface PlaylistFormProps {
  playlist?: Playlist | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  media: Media[]
  loadingMedia: boolean
}

const formSchema = z.object({
  name_en: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }).max(50),
  name_ml: z.string().max(50),
  description_en: z.string(),
  description_ml: z.string(),
  isActive: z.boolean()
})

const avoidDefaultDomBehavior = (e: Event) => {
  e.preventDefault();
};

export function PlaylistForm({ playlist, open, onOpenChange, onSuccess, media, loadingMedia }: PlaylistFormProps) {
  const [loading, setLoading] = useState(false)

  const isEditing = !!playlist

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: "",
      name_ml: "",
      description_en: "",
      description_ml: "",
      isActive: true
    }
  })

  useEffect(() => {
    if (playlist) {
    }
  }, [playlist])


  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    // try {
    //   setLoading(true)
    //   if (isEditing) {
    //     await api.updatePlaylist(playlist.id, formData)
    //   } else {
    //     await api.createPlaylist(formData)
    //   }
    //   onSuccess()
    //   onOpenChange(false)
    //   setFormData({
    //     name: "",
    //     nameML: "",
    //     description: "",
    //     mediaIds: [],
    //   })
    //   setErrors({})
    // } catch (error) {
    //   console.error("Error saving playlist:", error)
    // } finally {
    //   setLoading(false)
    // }
  }

  // const handleMediaToggle = (mediaId: string, checked: boolean) => {
  //   if (checked) {
  //     setFormData({ ...formData, mediaIds: [...formData.mediaIds, mediaId] })
  //   } else {
  //     setFormData({ ...formData, mediaIds: formData.mediaIds.filter((id) => id !== mediaId) })
  //   }
  // }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl" onInteractOutside={avoidDefaultDomBehavior} onPointerDownOutside={avoidDefaultDomBehavior}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Playlist" : "Create New Playlist"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update playlist information and media selection."
              : "Create a new playlist with selected media items."}
          </DialogDescription>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  )
}
