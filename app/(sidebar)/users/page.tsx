"use client"

import { useEffect, useState } from "react"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/users/users-table"
import { UserForm } from "@/components/users/user-form"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { api, type User } from "@/lib/api"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await api.getUsers()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleFormSuccess = () => {
    fetchUsers()
    setSelectedUser(null)
  }

  const handleDeleteSuccess = () => {
    fetchUsers()
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Users
          </h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser(null)
            setShowForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="animate-in fade-in-0 slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
        <UsersTable users={users} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Forms and Dialogs */}
      <UserForm user={selectedUser} open={showForm} onOpenChange={setShowForm} onSuccess={handleFormSuccess} />

      <DeleteUserDialog
        user={selectedUser}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
