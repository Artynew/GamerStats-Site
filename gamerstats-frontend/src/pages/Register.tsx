import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // ✅ Клиентская валидация
    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов.")
      return
    }

    try {
      await axios.post("https://localhost:7129/api/auth/register", {
        username,
        email,
        password,
      })

      setSuccess("Регистрация успешна!")
      setTimeout(() => navigate("/login"), 1500)
    } catch (err: any) {
      const data = err?.response?.data
      let errorMessage = "Ошибка регистрации"

      if (data?.errors) {
        const messages = Object.values(data.errors).flat()
        errorMessage = messages.join(", ")
      } else if (typeof data === "string") {
        errorMessage = data
      }

      setError(errorMessage)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Регистрация</h1>
      <p className="text-center text-gray-500 mb-6">Создайте новый аккаунт</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Имя пользователя"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          placeholder="Пароль (мин. 8 символов)"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800">
          Зарегистрироваться
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  )
}

export default Register
