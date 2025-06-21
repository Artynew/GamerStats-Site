function Home() {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Добро пожаловать в GamerStats!</h1>
        <p className="text-lg text-gray-300 mb-6">
          Здесь вы можете отслеживать свой прогресс в играх, делиться впечатлениями и формировать собственную коллекцию.
        </p>
  
        <div className="text-left space-y-3 bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-semibold">Что умеет GamerStats:</h2>
          <ul className="list-disc list-inside text-gray-200">
            <li>📌 Сохранять список пройденных и запланированных игр</li>
            <li>⭐ Оценивать и оставлять отзывы на игры</li>
            <li>✍️ Редактировать и удалять свои отзывы</li>
            <li>🔐 Безопасный вход с JWT-авторизацией</li>
            <li>📊 Следить за средней оценкой каждой игры</li>
          </ul>
        </div>
      </div>
    )
  }
  
  export default Home
  