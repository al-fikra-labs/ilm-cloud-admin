"use client"

import { useEffect, useState } from "react"
import { Plus, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin-layout"
import { CategoriesTable } from "@/components/categories/categories-table"
import { CategoryForm } from "@/components/categories/category-form"
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog"
import { CategoryMediaDialog } from "@/components/categories/category-media-dialog"
import { api, type Category } from "@/lib/api"
import Link from "next/link"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMediaDialog, setShowMediaDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await api.getCategories()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setShowForm(true)
  }

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }

  const handleViewMedia = (category: Category) => {
    setSelectedCategory(category)
    setShowMediaDialog(true)
  }

  const handleFormSuccess = () => {
    fetchCategories()
    setSelectedCategory(null)
  }

  const handleDeleteSuccess = () => {
    fetchCategories()
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderOpen className="h-8 w-8" />
            Categories
          </h1>
          <p className="text-muted-foreground">Organize media content into categories</p>
        </div>
        <Button
          asChild
        >
          <Link href={`/categories/manage-category`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
        <CategoriesTable
          categories={categories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewMedia={handleViewMedia}
        />
      </div>

      {/* Forms and Dialogs */}
      <CategoryForm
        category={selectedCategory}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteCategoryDialog
        category={selectedCategory}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />

      <CategoryMediaDialog category={selectedCategory} open={showMediaDialog} onOpenChange={setShowMediaDialog} />
    </div>
  )
}
