import type React from "react"
import AdminLayout from "@/components/admin-layout"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { api } from "@/lib/api"


export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    try {
        const cookie = await cookies()
        const token = cookie.get("token")?.value
        if (!token) {
            redirect("/login")
        }
        const admin = await api.getProfile(token)
        return (
            <AdminLayout admin={admin}>
                {children}
            </AdminLayout>
        )
    } catch (error) {
        redirect("/login")
    }
}
