import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"

type Props = {
  children: React.ReactElement
}

function PrivateRoute({ children }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <p>Загрузка...</p>

  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
