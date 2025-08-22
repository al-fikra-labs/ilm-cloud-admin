// const API_BASE = "https://947eb8e1-c73e-42c4-934a-6a4ffd00fda7.mock.pstmn.io"
const API_BASE = "http://localhost:4000/api/backend"

export interface User {
  id: string
  name: string
  bio: string
  createdAt: string
}

export interface Teacher {
  id: string
  name: string
  bio: string
  createdAt: string
}

export interface EditTeacher {
  id: string
  name_en: string
  name_ml: string
  bio_en: string
  bio_ml: string
  createdAt: string
}

export interface Media {
  id: string
  name: string
  nameML?: string
  fileUrl: string
  duration: number
  teacherId: string
  teacher?: Teacher
  isActive: boolean
  createdAt: string
}

export interface EditMedia {
  id: string
  name_en: string
  description_en: string
  description_ml: string
  name_ml: string
  fileUrl: string
  duration: string
  teacherId: string
  isActive: boolean
  createdAt: string
  teachers: {
    name_en: string
  }
}

export interface Playlist {
  id: string
  name: string
  description?: string
  createdAt: string
  mediaIds: string
}

export interface EditPlaylist {
  id: string
  name_en: string
  name_ml: string
  description_en: string
  description_ml: string
  createdAt: string
  mediaToPlaylist?: {
    mediaId: EditMedia
  }[]
}

export interface Category {
  id: string
  name: string
  mediaIds: string
  createdAt: string
}

export interface EditCategory {
  id: string
  name_en: string
  name_ml: string
  createdAt: string
  mediaToCategory?: {
    mediaId: EditMedia
  }[]
}

export const api = {
  // admins
  async getProfile(token:string): Promise<any> {
    const response = await fetch(`${API_BASE}/admins/profile`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },
  async login(values: {email: string, password: string}): Promise<{token: string}> {
    const response = await fetch(`${API_BASE}/admins/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    })
    if (!response.ok) {
      throw new Error((await response.json()).message)
    }
    return response.json()
  },

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE}/users`)
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to create user")
    return response.json()
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete user")
  },

  // Teachers
  async getTeachers(token:string): Promise<Teacher[]> {
    const response = await fetch(`${API_BASE}/teachers`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    if (!response.ok) throw new Error("Failed to fetch teachers")
    return response.json()
  },

  async getTeacher(id: string, token:string): Promise<EditTeacher> {
    const response = await fetch(`${API_BASE}/teachers/${id}`)
    if (!response.ok) throw new Error("Failed to fetch teachers")
    return response.json()
  },

  async createTeacher(teacher: Omit<EditTeacher, "id" | "createdAt">): Promise<EditTeacher> {
    const response = await fetch(`${API_BASE}/teachers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacher),
    })
    if (!response.ok) throw new Error("Failed to create teacher")
    return response.json()
  },

  async updateTeacher(id: string, teacher: Partial<EditTeacher>): Promise<EditTeacher> {
    const response = await fetch(`${API_BASE}/teachers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacher),
    })
    if (!response.ok) throw new Error("Failed to update teacher")
    return response.json()
  },

  async deleteTeacher(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/teachers/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete teacher")
  },

  // Media
  async getMedia(page: number = 1, limit: number = 10, search?: string, abort?: AbortController): Promise<Media[]> {
    let url = `${API_BASE}/media?page=${page}&limit=${limit}`
    if (search) url = url + `&search=${search}`
    const response = await fetch(url, { signal: abort?.signal })
    if (!response.ok) throw new Error("Failed to fetch media")
    return response.json()
  },

  async getMediaById(id: string): Promise<EditMedia> {
    const response = await fetch(`${API_BASE}/media/${id}`)
    if (!response.ok) throw new Error("Failed to fetch media")
    return response.json()
  },

  async createMedia(media: Omit<EditMedia, "id" | "createdAt" | "teachers">): Promise<EditMedia> {
    const response = await fetch(`${API_BASE}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(media),
    })
    if (!response.ok) throw new Error("Failed to create media")
    return response.json()
  },

  async updateMedia(id: string, media: Partial<Omit<EditMedia, "id" | "createdAt" | "teachers">>): Promise<EditMedia> {
    const response = await fetch(`${API_BASE}/media/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(media),
    })
    if (!response.ok) throw new Error("Failed to update media")
    return response.json()
  },

  async deleteMedia(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/media/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete media")
  },

  // Playlists
  async getPlaylists(): Promise<Playlist[]> {
    const response = await fetch(`${API_BASE}/playlists`)
    if (!response.ok) throw new Error("Failed to fetch playlists")
    return response.json()
  },

  async getPlaylistsById(id: string): Promise<EditPlaylist> {
    const response = await fetch(`${API_BASE}/playlists/${id}`)
    if (!response.ok) throw new Error("Failed to fetch playlists")
    return response.json()
  },

  async createPlaylist(playlist: Omit<EditPlaylist, "id" | "createdAt">): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/playlists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlist),
    })
    if (!response.ok) throw new Error("Failed to create playlist")
    return response.json()
  },

  async updatePlaylist(id: string, playlist: Partial<Omit<EditPlaylist, "id" | "createdAt">>): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/playlists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playlist),
    })
    if (!response.ok) throw new Error("Failed to update playlist")
    return response.json()
  },

  async addMediaToPlaylist(playlistId: string, mediaId: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({mediaId}),
    })
    if (!response.ok) throw new Error("Failed to update playlist")
    return response.json()
  },

  async removeMediaFromPlaylist(playlistId: string, mediaId: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}/media/${mediaId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to update playlist")
    return response.json()
  },

  async deletePlaylist(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/playlists/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete playlist")
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE}/categories`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  async getCategoryById(id: string): Promise<EditCategory> {
    const response = await fetch(`${API_BASE}/categories/${id}`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  async createCategory(category: Omit<EditCategory, "id" | "createdAt">): Promise<Category> {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error("Failed to create category")
    return response.json()
  },

  async updateCategory(id: string, category: Partial<Omit<EditCategory, "id" | "createdAt">>): Promise<Category> {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    if (!response.ok) throw new Error("Failed to update category")
    return response.json()
  },

  async addMediaToCategory(categoryId: string, mediaId: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/categories/${categoryId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({mediaId}),
    })
    if (!response.ok) throw new Error("Failed to update playlist")
    return response.json()
  },

  async removeMediaFromCategory(categoryId: string, mediaId: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/categories/${categoryId}/media/${mediaId}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to update playlist")
    return response.json()
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete category")
  },
}
