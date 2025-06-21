import { createContext, useContext, useEffect, useState } from "react"
import React from "react"

import axios from "axios"

type User = {
  id: number
  username: string
  email: string
  role: string
  games: {
    gameId: number
    title: string
    status: string
  }[]
}


type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => useContext(AuthContext)!

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const res = await axios.get("https://localhost:7129/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUser(res.data)
    } catch (err) {
      console.error("Не удалось получить профиль", err)
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await axios.post("https://localhost:7129/api/auth/login", {
      email,
      password,
    })

    localStorage.setItem("token", res.data.token)
    await fetchProfile()
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
