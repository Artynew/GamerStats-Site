import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"

interface User {
  id: number
  username: string
  email: string
  role: string
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `https://localhost:7129/api/users?page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
  
        if (res.data.length < 10) setHasMore(false)
  
        
        setUsers((prev) => {
          const existingIds = new Set(prev.map((u) => u.id))
          const filtered = res.data.filter((u: User) => !existingIds.has(u.id))
          return [...prev, ...filtered]
        })
      } catch (err) {
        console.error("Ошибка загрузки пользователей", err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchUsers()
  }, [page])
  

  const deleteUser = async (id: number) => {
    if (!confirm("Вы точно хотите удалить пользователя?")) return
    try {
      await axios.delete(`https://localhost:7129/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      alert("Ошибка удаления")
    }
  }
  

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Пользователи</h1>
      <table className="w-full text-left border border-gray-600">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">ID</th>
            <th className="p-2">Имя</th>
            <th className="p-2">Email</th>
            <th className="p-2">Роль</th>
            <th className="p-2">Удалить</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id} ref={idx === users.length - 1 ? lastUserRef : null}>
              <td className="border-t p-2">{user.id}</td>
              <td className="border-t p-2">{user.username}</td>
              <td className="border-t p-2">{user.email}</td>
              <td className="border-t p-2">{user.role}</td>
              <td className="border-t p-2">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="mt-4">Загрузка...</p>}
      {!hasMore && <p className="mt-4 text-gray-400">Все пользователи загружены</p>}
    </div>
  )
}

export default AdminUsers
