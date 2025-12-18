import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Players from './pages/Players.jsx'
import Sessions from './pages/Sessions.jsx'
import Matches from './pages/Matches.jsx'
import { clearUser, getUser } from './lib/auth.js'
import { loadStore, saveStore } from './lib/store.js'
import { useRef } from 'react'
import { defaultStore } from './lib/store.js'
import { downloadJson, readJsonFile } from './lib/io.js'


function RequireAuth({ children }) {
  const user = getUser()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

export default function App() {
  const [store, setStore] = useState(() => loadStore())
  const user = useMemo(() => getUser(), [])
  const fileRef = useRef(null)

  useEffect(() => {
    saveStore(store)
  }, [store])

  function logout() {
    clearUser()
    // recarga simple para “resetear” rutas/estado de auth en esta v0
    window.location.hash = '#/login'
    window.location.reload()
  }

  function exportData() {
  downloadJson('coachboard-data.json', store)
}

async function importData(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const data = await readJsonFile(file)
    // merge básico con defaults
    const next = { ...defaultStore(), ...data }
    next.players = Array.isArray(next.players) ? next.players : defaultStore().players
    next.sessions = Array.isArray(next.sessions) ? next.sessions : defaultStore().sessions
    next.matches = Array.isArray(next.matches) ? next.matches : defaultStore().matches
    setStore(next)
  } catch {
    alert("No se pudo importar el JSON.")
  } finally {
    e.target.value = ""
  }
}

function seed() {
  const ok = confirm("¿Cargar datos de ejemplo? Esto reemplaza los datos actuales.")
  if (!ok) return
  setStore(defaultStore())
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
            <Link className="pill" to="/matches">Partidos</Link>

          {getUser() ? (
            <>
              <button className="pill pillBtn" onClick={seed}>Ejemplo</button>
              <button className="pill pillBtn" onClick={exportData}>Exportar</button>

              <button className="pill pillBtn" onClick={() => fileRef.current?.click()}>Importar</button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                hidden
                onChange={importData}
              />

              <button
                className="pill"
                style={{ background: 'white', cursor: 'pointer' }}
                onClick={logout}
              >
                Salir
              </button>
            </>
          ) : (
            <Link className="pill" to="/login">Login</Link>
          )}
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

        <Route path="/matches" element={
          <RequireAuth>
            <Matches store={store} setStore={setStore} />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
