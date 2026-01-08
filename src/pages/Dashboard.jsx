export default function Dashboard({ store }) {
  const totalMinutes = (store.sessions || []).reduce((acc, s) => acc + (Number.isFinite(s.minutes) ? s.minutes : 0), 0)

  return (
    <div className="container main">
      <h1>Dashboard</h1>
      <p className="muted">Resumen rápido (v0).</p>

      <div className="grid">
        <div className="card">
          <h2>Jugadores</h2>
          <div className="row">
            <span className="pill">Total: {(store.players || []).length}</span>
          </div>
        </div>

        <div className="card">
          <h2>Sesiones</h2>
          <div className="row">
            <span className="pill">Total: {(store.sessions || []).length}</span>
            <span className="pill">Minutos: {totalMinutes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
