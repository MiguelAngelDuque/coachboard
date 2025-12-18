import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Players from './pages/Players.jsx'
import Sessions from './pages/Sessions.jsx'
import { clearUser, getUser } from './lib/auth.js'
import { loadStore, saveStore } from './lib/store.js'

function RequireAuth({ children }) {
  const user = getUser()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

export default function App() {
  const [store, setStore] = useState(() => loadStore())
  const user = useMemo(() => getUser(), [])

  useEffect(() => {
    saveStore(store)
  }, [store])

  function logout() {
    clearUser()
    // recarga simple para “resetear” rutas/estado de auth en esta v0
    window.location.hash = '#/login'
    window.location.reload()
  }

  return (
    <>
      <header className="header">
        <div className="container nav">
          <div className="logo">CoachBoard</div>
          <nav className="links">
            <Link className="pill" to="/">Dashboard</Link>
            <Link className="pill" to="/sessions">Sesiones</Link>
            <Link className="pill" to="/players">Jugadores</Link>
            {getUser()
              ? <button className="pill" style={{ background: 'white', cursor: 'pointer' }} onClick={logout}>Salir</button>
              : <Link className="pill" to="/login">Login</Link>
            }
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={
          <RequireAuth>
            <Dashboard store={store} user={user} />
          </RequireAuth>
        } />

        <Route path="/sessions" element={
          <RequireAuth>
            <Sessions store={store} setStore={setStore} />
          </RequireAuth>
        } />

        <Route path="/players" element={
          <RequireAuth>
            <Players store={store} setStore={setStore} />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
