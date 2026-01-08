import { useMemo, useState } from "react"
import { uid } from "../lib/store.js"

const empty = { id: "", opponent: "", date: "", location: "", homeAway: "Casa", callup: [], notes: "" }

export default function Matches({ store, setStore }) {
  const [form, setForm] = useState(empty)
  const [q, setQ] = useState("")

  const matches = store.matches || []
  const players = store.players || []

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return matches
    return matches.filter(m => `${m.opponent} ${m.location} ${m.notes}`.toLowerCase().includes(query))
  }, [matches, q])

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  function togglePlayer(pid) {
    setForm(prev => {
      const has = prev.callup.includes(pid)
      return { ...prev, callup: has ? prev.callup.filter(x => x !== pid) : [...prev.callup, pid] }
    })
  }

  function submit(e) {
    e.preventDefault()
    const opponent = form.opponent.trim()
    if (!opponent) return

    const payload = {
      id: form.id || uid(),
      opponent,
      date: form.date,
      location: form.location.trim(),
      homeAway: form.homeAway,
      callup: form.callup,
      notes: form.notes.trim(),
    }

    const exists = matches.some(m => m.id === payload.id)
    const next = exists ? matches.map(m => (m.id === payload.id ? payload : m)) : [payload, ...matches]
    setStore({ ...store, matches: next })
    setForm(empty)
  }

  function edit(m) {
    setForm({
      id: m.id,
      opponent: m.opponent || "",
      date: m.date || "",
      location: m.location || "",
      homeAway: m.homeAway || "Casa",
      callup: Array.isArray(m.callup) ? m.callup : [],
      notes: m.notes || "",
    })
  }

  function remove(id) {
    setStore({ ...store, matches: matches.filter(m => m.id !== id) })
    if (form.id === id) setForm(empty)
  }

  return (
    <div className="container main">
      <h1>Partidos</h1>

      <div className="grid">
        <div className="card">
          <h2>{form.id ? "Editar partido" : "Nuevo partido"}</h2>

          <form onSubmit={submit}>
            <div className="row">
              <input value={form.opponent} onChange={(e) => set("opponent", e.target.value)} placeholder="Rival *" />
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
              <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Lugar" />
              <select value={form.homeAway} onChange={(e) => set("homeAway", e.target.value)}>
                <option>Casa</option>
                <option>Fuera</option>
              </select>
            </div>

            <div style={{ marginTop: 10 }}>
              <textarea rows="2" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Notas" />
            </div>

            <div style={{ marginTop: 10 }}>
              <div className="muted" style={{ marginBottom: 8 }}>
                Convocatoria ({form.callup.length})
              </div>
              <div className="row">
                {players.map(p => (
                  <label key={p.id} className="pill" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" checked={form.callup.includes(p.id)} onChange={() => togglePlayer(p.id)} />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn" type="submit">{form.id ? "Guardar" : "Añadir"}</button>
              {form.id && <button className="btn ghost" type="button" onClick={() => setForm(empty)}>Cancelar</button>}
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Listado</h2>

          <div className="row">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." />
            <span className="pill">Mostrando: {filtered.length}</span>
          </div>

          <div className="list" style={{ marginTop: 12 }}>
            {filtered.map(m => (
              <div className="item" key={m.id}>
                <div>
                  <div className="title">{m.homeAway}: {m.opponent}</div>
                  <div className="meta">
                    {m.date ? `📅 ${m.date}` : "📅 sin fecha"}
                    {m.location ? ` · 📍 ${m.location}` : ""}
                    {Array.isArray(m.callup) ? ` · 👥 Convocados: ${m.callup.length}` : ""}
                    {m.notes ? ` · 📝 ${m.notes}` : ""}
                  </div>
                </div>
                <div className="row">
                  <button className="btn ghost" type="button" onClick={() => edit(m)}>Editar</button>
                  <button className="btn ghost" type="button" onClick={() => remove(m.id)}>Borrar</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className="muted">No hay partidos.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
