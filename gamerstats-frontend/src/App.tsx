import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Layout from "./components/Layout"
import AdminPanel from "./pages/AdminPanel"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import GameList from "./pages/GameList"
import GameDetails from "./pages/GameDetails"
import NotFound from "./pages/NotFound"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminGames from "./pages/admin/AdminGames"
import AdminStats from "./pages/admin/AdminStats"
import GameCreate from "./pages/GameCreate"
import AdminRoute from "./components/AdminRoute"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <>
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route path="/games" element={<PrivateRoute><GameList /></PrivateRoute>} />
          <Route path="/games/:id" element={<PrivateRoute><GameDetails /></PrivateRoute>} />

          <Route
            path="/games/new"
            element={
              <PrivateRoute>
                <GameCreate />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/games"
            element={
              <AdminRoute>
                <AdminGames />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <AdminRoute>
                <AdminStats />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
