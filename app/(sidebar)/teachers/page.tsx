"use client"

import { useEffect, useState } from "react"
import { Plus, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TeachersTable } from "@/components/teachers/teachers-table"
import { TeacherForm } from "@/components/teachers/teacher-form"
import { DeleteTeacherDialog } from "@/components/teachers/delete-teacher-dialog"
import { api, type Teacher } from "@/lib/api"
import Cookies from "js-cookie"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const clearTeacher = () => setSelectedTeacher(null)

  const fetchTeachers = async () => {
    const token = Cookies.get('token')
    if(!token) return;
    try {
      setLoading(true)
      const data = await api.getTeachers()
      setTeachers(data)
    } catch (error) {
      console.error("Error fetching teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setShowForm(true)
  }

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setShowDeleteDialog(true)
  }

  const handleFormSuccess = () => {
    fetchTeachers()
    setSelectedTeacher(null)
  }

  const handleDeleteSuccess = () => {
    fetchTeachers()
    setSelectedTeacher(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Teachers
          </h1>
          <p className="text-muted-foreground">Manage teacher profiles and information</p>
        </div>
        <Button
          onClick={() => {
            setSelectedTeacher(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      {/* Teachers Table */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
        <TeachersTable teachers={teachers} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Forms and Dialogs */}
      <TeacherForm
        teacher={selectedTeacher}
        clearTeacher={clearTeacher}
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleFormSuccess}
      />

      <DeleteTeacherDialog
        teacher={selectedTeacher}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
