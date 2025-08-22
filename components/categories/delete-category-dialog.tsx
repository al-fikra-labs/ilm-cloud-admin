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
import { api, type Category } from "@/lib/api"

interface DeleteCategoryDialogProps {
  category: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteCategoryDialog({ category, open, onOpenChange, onSuccess }: DeleteCategoryDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!category) return

    try {
      setLoading(true)
      await api.deleteCategory(category.id)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting category:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{category?.name}</strong>? This action cannot be undone and will
            remove the category containing {category?.mediaIds?.length || 0} media items.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
