import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"
import STATUS_OPTIONS from "../constants/statuses"

type Feedback = {
  id: number
  userId: number
  username: string
  comment: string | null
  rating: number | null
  status: string
}

type Game = {
  id: number
  title: string
  genre: string
  averageRating: number | null
}

type UserStat = {
  id: number
  gameId: number
  status: string
  comment: string | null
  rating: number | null
}

function GameDetails() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [game, setGame] = useState<Game | null>(null)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  const [comment, setComment] = useState("")
  const [rating, setRating] = useState<number | "">("")
  const [status, setStatus] = useState("not_started")
  const [statId, setStatId] = useState<number | null>(null)
  const [hasFeedback, setHasFeedback] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, feedbackRes] = await Promise.all([
          axios.get(`https://localhost:7129/api/games/${id}`),
          axios.get(`https://localhost:7129/api/gamestats/game/${id}/feedback`),
        ])
        setGame(gameRes.data)
        setFeedbacks(feedbackRes.data)

        if (user) {
          const statsRes = await axios.get(`https://localhost:7129/api/gamestats/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
          const stat = statsRes.data.find((s: UserStat) => s.gameId === Number(id))
          if (stat) {
            setStatus(stat.status)
            setStatId(stat.id)
            if (stat.comment || stat.rating !== null) setHasFeedback(true)
          } else {
            setStatus("not_started")
            setStatId(null)
          }
        }
      } catch (err) {
        console.error("Ошибка загрузки данных игры", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  if (loading) return <p>Загрузка...</p>
  if (!game) return <p>Игра не найдена</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("Для добавления отзыва нужно войти в систему")
      return
    }
    const ratingNumber = Number(rating)
    if (!ratingNumber || ratingNumber < 1 || ratingNumber > 10) {
      alert("Рейтинг должен быть от 1 до 10")
      return
    }

    try {
      let currentStatId = statId

      if (!currentStatId) {
        const createRes = await axios.post(
          `https://localhost:7129/api/gamestats`,
          { gameId: game!.id, status },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
        currentStatId = createRes.data.id
        setStatId(currentStatId)
      } else {
        await axios.patch(
          `https://localhost:7129/api/gamestats/${currentStatId}/status`,
          JSON.stringify(status),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      }

      if (currentStatId) {
        await axios.patch(
          `https://localhost:7129/api/gamestats/${currentStatId}/feedback`,
          { rating: ratingNumber, comment },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      }

      const feedbackRes = await axios.get(`https://localhost:7129/api/gamestats/game/${game!.id}/feedback`)
      setFeedbacks(feedbackRes.data)

      alert("Данные успешно обновлены")
      setComment("")
      setRating("")
      setHasFeedback(true)
    } catch (err) {
      alert("Ошибка при отправке данных")
      console.error(err)
    }
  }

  const handleDeleteFeedback = async () => {
    if (!statId) return
    try {
      await axios.delete(`https://localhost:7129/api/gamestats/${statId}/feedback`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setComment("")
      setRating("")
      setHasFeedback(false)

      const feedbackRes = await axios.get(`https://localhost:7129/api/gamestats/game/${game!.id}/feedback`)
      setFeedbacks(feedbackRes.data)
      alert("Отзыв удалён.")
    } catch {
      alert("Ошибка при удалении отзыва")
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
      <p className="italic mb-2">{game.genre}</p>
      <p className="mb-4">
        Средний рейтинг: {game.averageRating !== null ? `⭐ ${game.averageRating}` : "—"}
      </p>

      <div className="mb-6">
        <label className="block font-medium mb-1">Статус игры</label>
        <select
          className="border rounded p-2"
          value={status}
          onChange={async (e) => {
            const newStatus = e.target.value
            setStatus(newStatus)
            if (!statId) return
            try {
              await axios.patch(
                `https://localhost:7129/api/gamestats/${statId}/status`,
                JSON.stringify(newStatus),
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              )
            } catch {
              alert("Ошибка обновления статуса")
            }
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-2">Отзывы</h2>
      {feedbacks.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="border-b border-gray-700 pb-2">
              <div>
                <strong>{fb.username}</strong>{" "}
                {fb.status && (
                  <span className="text-sm text-gray-400">
                    [
                    {
                      STATUS_OPTIONS.find((opt) => opt.value === fb.status)?.label ??
                      fb.status
                    }
                    ]
                  </span>
                )}
              </div>
              <div>
                {fb.comment || "Без комментария"}
                {fb.rating !== null && <span> — ⭐ {fb.rating}</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Отзывов пока нет</p>
      )}


      {user && !hasFeedback && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1 font-medium">Рейтинг (1–10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
              className="border rounded p-2 w-full text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border rounded p-2 w-full text-white"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Сохранить отзыв и статус
          </button>
        </form>
      )}

      {user && hasFeedback && (
        <div className="mt-4 space-x-3">
          <button
            className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-600"
            onClick={() => setHasFeedback(false)}
          >
            Изменить отзыв
          </button>
          <button
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            onClick={handleDeleteFeedback}
          >
            Удалить отзыв
          </button>
        </div>
      )}
    </div>
  )
}

export default GameDetails
