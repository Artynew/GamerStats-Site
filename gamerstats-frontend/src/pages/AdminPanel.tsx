import { useNavigate } from "react-router-dom"

function AdminPanel() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Админ-панель</h1>

      <div className="flex flex-col gap-4 max-w-xs">
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Пользователи
        </button>
        <button
          onClick={() => navigate("/admin/games")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Игры
        </button>
        <button
          onClick={() => navigate("/admin/stats")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Статистика
        </button>
      </div>
    </div>
  )
}

export default AdminPanel
