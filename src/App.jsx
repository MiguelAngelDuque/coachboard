import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Players from './pages/Players.jsx'
import Sessions from './pages/Sessions.jsx'
import Matches from './pages/Matches.jsx'
import MatchDetail from './pages/MatchDetail.jsx'
import { clearUser, getUser } from './lib/auth.js'
import { defaultStore, loadStore, saveStore, normalizeStore, STORE_KEY } from './lib/store.js'
import { downloadJson, readJsonFile } from './lib/io.js'

function RequireAuth({ children }) {
  const user = getUser()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

export default function App() {
  const [store, setStore] = useState(() => loadStore())
  const fileRef = useRef(null)

  useEffect(() => {
    saveStore(store)
  }, [store])

  function logout() {
    clearUser()
    window.location.hash = '#/login'
    window.location.reload()
  }

  function seed() {
    const ok = confirm("¿Cargar datos de ejemplo? Esto reemplaza los datos actuales.")
    if (!ok) return
    setStore(defaultStore())
  }

  function exportData() {
  const d = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  downloadJson(`coachboard-${d}.json`, store)
}

function resetDemo() {
  const ok = confirm("¿Resetear datos de la app? (Solo borra los datos de CoachBoard en este navegador)")
  if (!ok) return
  localStorage.removeItem(STORE_KEY)
  setStore(defaultStore())
}



  async function importData(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await readJsonFile(file)
      const next = { ...defaultStore(), ...data }
      next.players = Array.isArray(next.players) ? next.players : defaultStore().players
      next.sessions = Array.isArray(next.sessions) ? next.sessions : defaultStore().sessions
      next.matches = Array.isArray(next.matches) ? next.matches : defaultStore().matches
      setStore(normalizeStore(data))
    } catch {
      alert("No se pudo importar el JSON.")
    } finally {
      e.target.value = ""
    }
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
                <button className="pill" style={{ cursor: 'pointer' }} onClick={seed}>Ejemplo</button>
                <button className="pill" style={{ cursor: 'pointer' }} onClick={exportData}>Exportar</button>
                
                <button className="pill" style={{ cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>Importar</button>
                <button className="pill pillBtn" onClick={resetDemo}>Reset</button>

                <input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} />

                <button className="pill" style={{ cursor: 'pointer' }} onClick={logout}>Salir</button>
              </>
            ) : (
              <Link className="pill" to="/login">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RequireAuth><Dashboard store={store} /></RequireAuth>} />
        <Route path="/sessions" element={<RequireAuth><Sessions store={store} setStore={setStore} /></RequireAuth>} />
        <Route path="/players" element={<RequireAuth><Players store={store} setStore={setStore} /></RequireAuth>} />
        <Route path="/matches" element={<RequireAuth><Matches store={store} setStore={setStore} /></RequireAuth>} />
        <Route path="/matches/:id" element={<RequireAuth><MatchDetail store={store} /></RequireAuth>} />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
