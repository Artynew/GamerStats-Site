import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

type Props = {
  children: React.ReactNode
}

function AdminRoute({ children }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <p>Загрузка...</p>

  if (!user || user.role !== "Admin") {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default AdminRoute
