import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
      navigate("/profile")
    } catch (err) {
      setError("Неверный email или пароль")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Вход</h1>
      <p className="text-center text-gray-800 mb-6">Авторизуйтесь, чтобы продолжить</p>
  
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800">
          Войти
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
  
}

export default Login
