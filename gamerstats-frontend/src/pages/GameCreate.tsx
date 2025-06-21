import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function GameCreate() {
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !genre) {
      alert("Пожалуйста, заполните все поля.")
      return
    }

    try {
      await axios.post(
        "https://localhost:7129/api/games",
        { title, genre },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      alert("Игра отправлена на модерацию")
      navigate("/games")
    } catch (err) {
      alert("Ошибка при создании игры")
      console.error(err)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Добавить игру</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded border text-white"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Жанр</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 rounded border text-white"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Отправить
        </button>
      </form>
    </div>
  )
}

export default GameCreate
