import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import axios from "axios"
import STATUS_OPTIONS from "../constants/statuses"

type FeedbackData = {
  comment: string
  rating: number | ""
  editing: boolean
}

function Profile() {
  const { user, isLoading } = useAuth()
  const [gamesStats, setGamesStats] = useState<any[]>([])
  const [formData, setFormData] = useState<Record<number, FeedbackData>>({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://localhost:7129/api/gamestats/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        setGamesStats(res.data)

        const initialData: Record<number, FeedbackData> = {}
        res.data.forEach((gs: any) => {
          initialData[gs.id] = {
            comment: gs.comment || "",
            rating: gs.rating ?? "",
            editing: false,
          }
        })
        setFormData(initialData)
      } catch {
        console.error("Не удалось загрузить игры пользователя")
      }
    }

    if (user) fetchStats()
  }, [user])

  const updateStatus = async (statId: number, newStatus: string) => {
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
  
      setGamesStats((prev) =>
        prev.map((gs) =>
          gs.id === statId ? { ...gs, status: newStatus } : gs
        )
      )
    } catch {
      alert("Ошибка при обновлении статуса")
    }
  }

  const updateFeedback = async (statId: number) => {
    const { comment, rating } = formData[statId]
    try {
      await axios.patch(
        `https://localhost:7129/api/gamestats/${statId}/feedback`,
        {
          comment,
          rating: rating === "" ? null : rating,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setGamesStats((prev) =>
        prev.map((gs) =>
          gs.id === statId
            ? { ...gs, comment, rating: rating === "" ? null : rating }
            : gs
        )
      )

      setFormData((prev) => ({
        ...prev,
        [statId]: {
          ...prev[statId],
          editing: false,
        },
      }))

      alert("Отзыв обновлён!")
    } catch {
      alert("Ошибка при обновлении отзыва")
    }
  }

  const deleteFeedback = async (statId: number) => {
    try {
        await axios.delete(`https://localhost:7129/api/gamestats/${statId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          
          // Удаляем из локального состояния
          setGamesStats((prev) => prev.filter((gs) => gs.id !== statId))
          
          // Удаляем из формы
          setFormData((prev) => {
            const updated = { ...prev }
            delete updated[statId]
            return updated
          })

      setGamesStats((prev) =>
        prev.map((gs) =>
          gs.id === statId ? { ...gs, comment: null, rating: null } : gs
        )
      )

      setFormData((prev) => ({
        ...prev,
        [statId]: {
          ...prev[statId],
          comment: "",
          rating: "",
          editing: false,
        },
      }))

      alert("Отзыв удалён.")
    } catch {
      alert("Ошибка при удалении отзыва")
    }
  }

  const toggleEdit = (statId: number) => {
    setFormData((prev) => ({
      ...prev,
      [statId]: {
        ...prev[statId],
        editing: !prev[statId].editing,
      },
    }))
  }

  if (isLoading) return <p>Загрузка профиля...</p>
  if (!user) return <p>Пользователь не авторизован</p>

  return (
  <div className="bg-gray-800 text-white p-6 rounded shadow max-w-4xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Профиль</h1>
    <p><strong>Имя:</strong> {user.username}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Роль:</strong> {user.role}</p>

    <h2 className="text-xl font-semibold mt-6 mb-2">Ваши игры:</h2>
    {gamesStats.length > 0 ? (
      <ul className="space-y-6">
        {gamesStats.map((gs) => {
          const data = formData[gs.id]
          const hasReview = gs.comment || gs.rating !== null

          return (
            <li key={gs.id} className="border-b border-gray-700 pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <span className="font-medium text-lg">{gs.gameTitle}</span>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <label className="text-sm">Статус:</label>
                  <select
                    value={gs.status}
                    onChange={(e) => updateStatus(gs.id, e.target.value)}
                    className="border rounded p-1 text-white"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasReview && (
                <div className="mt-3 text-sm text-gray-300">
                  <p><strong>Ваш отзыв:</strong> {gs.comment || "—"}</p>
                  {gs.rating !== null && <p><strong>Рейтинг:</strong> ⭐ {gs.rating}</p>}
                </div>
              )}

              {hasReview && (
                <div className="flex gap-3 mt-3">
                  <button
                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
                    onClick={() => toggleEdit(gs.id)}
                  >
                    {data?.editing ? "Отмена" : "Изменить отзыв"}
                  </button>
                  <button
                    className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteFeedback(gs.id)}
                  >
                    Удалить отзыв
                  </button>
                </div>
              )}

              {data?.editing && (
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium">Комментарий:</label>
                  <textarea
                    value={data.comment}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [gs.id]: {
                          ...prev[gs.id],
                          comment: e.target.value,
                        },
                      }))
                    }
                    rows={3}
                    className="w-full border rounded p-2 text-white"
                  />

                  <label className="block text-sm font-medium mt-2">Рейтинг (1–10):</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={data.rating}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [gs.id]: {
                          ...prev[gs.id],
                          rating: e.target.value === "" ? "" : Number(e.target.value),
                        },
                      }))
                    }
                    className="w-full border rounded p-2 text-white"
                  />

                  <button
                    className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={() => updateFeedback(gs.id)}
                  >
                    Сохранить отзыв
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    ) : (
      <p className="text-gray-400">У вас пока нет добавленных игр.</p>
    )}
  </div>
)

}

export default Profile
