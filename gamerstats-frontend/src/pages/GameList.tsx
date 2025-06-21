import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

type Game = {
  id: number
  title: string
  genre: string
  averageRating: number | null
}

function GameList() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const url = search.trim()
          ? `https://localhost:7129/api/games/search?query=${encodeURIComponent(search)}`
          : `https://localhost:7129/api/games`

        const res = await axios.get(url)
        setGames(res.data)
      } catch (error) {
        console.error("Ошибка загрузки игр", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [search])

  if (loading) return <p>Загрузка списка игр...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список игр</h1>

      {user && (
        <div className="mb-4">
          <Link
            to="/games/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Добавить новую игру
          </Link>
        </div>
      )}

      <input
        type="text"
        placeholder="Поиск по названию или жанру..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 rounded border w-full text-white"
      />

      {games.length === 0 ? (
        <p className="text-red-400">Игр с таким названием не существует.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id} className="border-b py-2 flex justify-between items-center">
              <Link to={`/games/${game.id}`} className="text-blue-400 hover:underline w-1/3">
                {game.title}
              </Link>
              <span className="text-center w-1/3">{game.genre}</span>
              <span className="text-right w-1/3">
                {game.averageRating !== null ? `⭐ ${game.averageRating}` : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GameList
