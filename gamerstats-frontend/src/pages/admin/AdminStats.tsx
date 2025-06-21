import { useEffect, useState, useRef, useCallback } from "react"
import axios from "axios"

interface Stat {
  id: number
  username: string
  gameTitle: string
  status: string
}

function AdminStats() {
  const [stats, setStats] = useState<Stat[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)
  const lastRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `https://localhost:7129/api/gamestats?page=${page}&size=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        if (res.data.length < 10) setHasMore(false)

        setStats((prev) => {
          const existingIds = new Set(prev.map((s) => s.id))
          const filtered = res.data.filter((s: Stat) => !existingIds.has(s.id))
          return [...prev, ...filtered]
        })
      } catch (err) {
        console.error("Ошибка загрузки статистики", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [page])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Статистика</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="border p-2">ID</th>
            <th className="border p-2">Пользователь</th>
            <th className="border p-2">Игра</th>
            <th className="border p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, idx) => (
            <tr
              key={s.id}
              ref={idx === stats.length - 1 ? lastRef : null}
              className="text-center"
            >
              <td className="border p-2">{s.id}</td>
              <td className="border p-2">{s.username}</td>
              <td className="border p-2">{s.gameTitle}</td>
              <td className="border p-2">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="mt-4 text-center">Загрузка...</p>}
      {!hasMore && <p className="mt-4 text-center text-gray-400">Конец списка</p>}
    </div>
  )
}

export default AdminStats
