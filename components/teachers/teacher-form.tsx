"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api, type EditTeacher } from "@/lib/api"
import { SubmitHandler, useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import Cookies from "js-cookie"

interface TeacherFormProps {
  teacher: { id: string } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  clearTeacher: () => void
}

const avoidDefaultDomBehavior = (e: Event) => {
  e.preventDefault();
};

const formSchema = z.object({
  name_en: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }).max(50),
  name_ml: z.string().max(50),
  bio_en: z.string(),
  bio_ml: z.string()
})

export function TeacherForm({ teacher, open, onOpenChange, onSuccess, clearTeacher }: TeacherFormProps) {
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: "",
      name_ml: "",
      bio_en: "",
      bio_ml: ""
    }
  })

  const isEditing = !!teacher

  const fetchTeachers = async (id: string) => {
    const token = Cookies.get('token')
    if(!token) return;
    try {
      setLoading(true)
      const data: EditTeacher = await api.getTeacher(id, token)
      form.setValue("name_en", data.name_en)
      form.setValue("name_ml", data.name_ml)
      form.setValue("bio_en", data.bio_en)
      form.setValue("bio_ml", data.bio_ml)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (teacher) {
      fetchTeachers(teacher.id)
    }
    return () => form.reset()
  }, [teacher])

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      setLoading(true)
      if (isEditing) {
        await api.updateTeacher(teacher.id, values)
      } else {
        await api.createTeacher(values)
      }
      onSuccess()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Error saving teacher:", error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl" onInteractOutside={avoidDefaultDomBehavior} onPointerDownOutside={avoidDefaultDomBehavior}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update teacher information." : "Create a new teacher profile."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 gap-y-6">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name English</FormLabel>
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
                    <FormLabel>Name Malayalam</FormLabel>
                    <FormControl>
                      <Input  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio English</FormLabel>
                    <FormControl>
                      <Textarea  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio_ml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio Malayalam</FormLabel>
                    <FormControl>
                      <Textarea  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter teacher name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Enter teacher bio (optional)"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div> */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !open}>
                {loading ? "Saving..." : isEditing ? "Update Teacher" : "Create Teacher"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
