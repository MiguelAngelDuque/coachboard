export default function Dashboard({ store }) {
  const players = store.players || []
  const sessions = store.sessions || []
  const matches = store.matches || []

  const totalMinutes = sessions.reduce(
    (acc, s) => acc + (Number.isFinite(s.minutes) ? s.minutes : 0),
    0
  )

  const totalCallups = matches.reduce(
    (acc, m) => acc + (Array.isArray(m.callup) ? m.callup.length : 0),
    0
  )

  const upcoming = matches
    .filter(m => m.date && typeof m.date === "string" && m.date.length >= 10)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="container main">
      <h1>Dashboard</h1>
      <p className="muted">Resumen rápido del equipo.</p>

      <div className="grid">
        <div className="card">
          <h2>Jugadores</h2>
          <div className="row">
            <span className="pill">Total: {players.length}</span>
          </div>
        </div>

        <div className="card">
          <h2>Sesiones</h2>
          <div className="row">
            <span className="pill">Total: {sessions.length}</span>
            <span className="pill">Minutos: {totalMinutes}</span>
          </div>
        </div>

        <div className="card">
          <h2>Partidos</h2>
          <div className="row">
            <span className="pill">Total: {matches.length}</span>
            <span className="pill">Convocados (sum): {totalCallups}</span>
          </div>
        </div>

        <div className="card">
          <h2>Próximo partido</h2>
          {upcoming ? (
            <p>
              <b>{upcoming.homeAway}:</b> {upcoming.opponent}
              {upcoming.date ? ` · ${upcoming.date}` : ""}
              {upcoming.location ? ` · ${upcoming.location}` : ""}
            </p>
          ) : (
            <p className="muted">No hay partidos con fecha.</p>
          )}
        </div>
      </div>
    </div>
  )
}
