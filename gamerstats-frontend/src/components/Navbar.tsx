import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="px-6 py-4 max-w-6xl mx-auto flex justify-between items-center">
      <Link
        to="/"
        className="text-xl font-bold text-blue-400 hover:text-red-400"
      >
        GamerStats
      </Link>

      <div className="flex gap-4 ml-auto pr-6">
        <Link
          to="/games"
          className="hover:underline text-blue-400 hover:text-red-400"
        >
          Игры
        </Link>

        {user && (
          <Link
            to="/profile"
            className="hover:underline text-blue-400 hover:text-red-400"
          >
            Профиль
          </Link>
        )}

        {user?.role === "Admin" && (
          <Link
            to="/admin"
            className="hover:underline text-red-400 font-semibold"
          >
            Админ
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="opacity-100 font-bold text-white">{user.username}</span>
            <button
              onClick={handleLogout}
              className="hover:underline text-red-300"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Войти
            </Link>
            <Link to="/register" className="hover:underline">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
