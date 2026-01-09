import { Link, useParams } from "react-router-dom"

export default function MatchDetail({ store }) {
  const { id } = useParams()
  const matches = store.matches || []
  const players = store.players || []
  const playersById = Object.fromEntries(players.map(p => [p.id, p.name]))

  const match = matches.find(m => m.id === id)

  if (!match) {
    return (
      <div className="container main">
        <h1>Partido</h1>
        <p className="muted">No encontrado.</p>
        <Link className="pill" to="/matches">← Volver</Link>
      </div>
    )
  }

  const callupNames = (match.callup || []).map(pid => playersById[pid]).filter(Boolean)

  return (
    <div className="container main">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Detalle partido</h1>
        <Link className="pill" to="/matches">← Volver</Link>
      </div>

      <div className="card">
        <h2>{match.homeAway}: {match.opponent}</h2>
        <p className="muted">
          {match.date ? `📅 ${match.date}` : "📅 sin fecha"}
          {match.location ? ` · 📍 ${match.location}` : ""}
        </p>

        {match.notes && (
          <p><b>Notas:</b> {match.notes}</p>
        )}

        <h2 style={{ marginTop: 18 }}>Convocatoria ({callupNames.length})</h2>
        {callupNames.length ? (
          <ul>
            {callupNames.map((n) => <li key={n}>{n}</li>)}
          </ul>
        ) : (
          <p className="muted">Sin convocados.</p>
        )}
      </div>
    </div>
  )
}
