"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { api, type EditMedia, type Teacher } from "@/lib/api"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "../ui/textarea"

interface MediaFormProps {
  media?: { id: string } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  teachers: Teacher[] | []
  loadingTeachers: boolean
}

const avoidDefaultDomBehavior = (e: Event) => {
  e.preventDefault();
};

const formSchema = z.object({
  name_en: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }).max(50),
  name_ml: z.string().max(50),
  description_en: z.string(),
  description_ml: z.string(),
  teacherId: z.string().uuid(),
  // .or(z.object({ value: z.string().uuid(), label: z.string() })),
  fileUrl: z.string().min(1),
  duration: z.string(),
  isActive: z.boolean()
})


export function MediaForm({ media, open, onOpenChange, onSuccess, teachers, loadingTeachers }: MediaFormProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!media;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: "",
      name_ml: "",
      description_en: "",
      description_ml: "",
      teacherId: "",
      fileUrl: "",
      duration: "",
      isActive: true
    }
  })

  const fetchMedia = async (id: string) => {
    try {
      setLoading(true)
      const data: EditMedia = await api.getMediaById(id)
      form.setValue('name_en', data.name_en || "")
      form.setValue('name_ml', data.name_ml || "")
      form.setValue('fileUrl', data.fileUrl || "")
      form.setValue('teacherId', data.teacherId || "")
      form.setValue('description_en', data.description_en || "")
      form.setValue('description_ml', data.description_ml || "")
      form.setValue('duration', data.duration || "")
      form.setValue('isActive', data.isActive)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (media) {
      fetchMedia(media.id)
    }
    return () => {
      form.reset()
      setLoading(false)
    }
  }, [media])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      setLoading(true)
      if (isEditing) {
        await api.updateMedia(media.id, values)
      } else {
        await api.createMedia(values)
      }
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error saving media:", error)
    } finally{
      setLoading(false)
    }
  }

  // const formatDuration = (seconds: number) => {
  //   const minutes = Math.floor(seconds / 60)
  //   const remainingSeconds = seconds % 60
  //   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  // }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Media" : "Add New Media"}</DialogTitle>
          <DialogDescription>{isEditing ? "Update media information." : "Create a new media item."}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 gap-y-6">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (EN)</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_ml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (ML)</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (EN)</FormLabel>
                    <FormControl>
                      <Textarea  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description_ml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (ML)</FormLabel>
                    <FormControl>
                      <Textarea  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>File URL</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select
                      onValueChange={field.onChange} value={field.value}
                    // defaultValue="3f9b6237-99d8-4fd1-b4e3-a8d5a4177b9d"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingTeachers ? "Loading..." : "Select teacher"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>Enable this media item for publi c access</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !open}>
                {loading ? "Saving..." : isEditing ? "Update Media" : "Create Media"}
              </Button>
            </DialogFooter>
          </form>

        </Form>

      </DialogContent>
    </Dialog>
  )
}
