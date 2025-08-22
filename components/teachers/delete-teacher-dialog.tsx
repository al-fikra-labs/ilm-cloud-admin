"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api, type Teacher } from "@/lib/api"

interface DeleteTeacherDialogProps {
  teacher: Teacher | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteTeacherDialog({ teacher, open, onOpenChange, onSuccess }: DeleteTeacherDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!teacher) return

    try {
      setLoading(true)
      await api.deleteTeacher(teacher.id)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting teacher:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Teacher</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{teacher?.name}</strong>? This action cannot be undone and may
            affect associated media content.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
