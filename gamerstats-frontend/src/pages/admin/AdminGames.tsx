import { useEffect, useState } from "react"
import axios from "axios"

interface Game {
  id: number
  title: string
  genre: string
}

function AdminGames() {
  const [games, setGames] = useState<Game[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchGames = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await axios.get(`https://localhost:7129/api/games?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (res.data.length < 10) setHasMore(false)
      setGames((prev) => {
        const existingIds = new Set(prev.map((g) => g.id))
        const filtered = res.data.filter((g: Game) => !existingIds.has(g.id))
        return [...prev, ...filtered]
      })
      setPage((prev) => prev + 1)
    } catch {
      alert("Ошибка загрузки игр")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        fetchGames()
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const deleteGame = async (id: number) => {
    if (!confirm("Удалить игру?")) return
    try {
      await axios.delete(`https://localhost:7129/api/admin/games/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setGames((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      alert("Ошибка удаления")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Игры (Админка)</h1>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Жанр</th>
            <th className="p-2 border">Удалить</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="hover:bg-gray-700">
              <td className="p-2 border">{game.id}</td>
              <td className="p-2 border">{game.title}</td>
              <td className="p-2 border">{game.genre}</td>
              <td className="p-2 border">
                <button
                  onClick={() => deleteGame(game.id)}
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
      {!hasMore && <p className="mt-4 text-gray-400">Все данные загружены</p>}
    </div>
  )
}

export default AdminGames
