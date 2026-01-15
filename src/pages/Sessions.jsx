import { useMemo, useState } from 'react'
import { uid } from '../lib/store.js'

const empty = { id: '', type: 'Entreno', title: '', date: '', minutes: '', notes: '' }

export default function Sessions({ store, setStore }) {
  const [form, setForm] = useState(empty)
  const [q, setQ] = useState('')
  const sessions = store.sessions || []

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return sessions
    return sessions.filter(s => `${s.type} ${s.title} ${s.notes}`.toLowerCase().includes(query))
  }, [sessions, q])

  // ✅ Orden: más recientes primero; los sin fecha al final
  const sorted = useMemo(() => {
    return filtered.slice().sort((a, b) => {
      const ad = a.date || ''
      const bd = b.date || ''
      if (!ad && !bd) return 0
      if (!ad) return 1
      if (!bd) return -1
      return bd.localeCompare(ad)
    })
  }, [filtered])

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  function submit(e) {
    e.preventDefault()
    const title = form.title.trim()
    if (form.minutes !== '' && Number(form.minutes) < 0) {
    alert("Los minutos no pueden ser negativos.")
    return
    }

    if (!title) return

    const payload = {
      id: form.id || uid(),
      type: form.type,
      title,
      date: form.date,
      minutes: form.minutes === '' ? '' : Number(form.minutes),
      notes: form.notes.trim(),
    }

    const exists = sessions.some(s => s.id === payload.id)
    const next = exists ? sessions.map(s => (s.id === payload.id ? payload : s)) : [payload, ...sessions]
    setStore({ ...store, sessions: next })
    setForm(empty)
  }

  function edit(s) {
    setForm({
      id: s.id,
      type: s.type,
      title: s.title,
      date: s.date || '',
      minutes: s.minutes === '' ? '' : String(s.minutes),
      notes: s.notes || '',
    })
  }

  function remove(id) {
    setStore({ ...store, sessions: sessions.filter(s => s.id !== id) })
    if (form.id === id) setForm(empty)
  }

  return (
    <div className="container main">
      <h1>Sesiones</h1>

      <div className="grid">
        <div className="card">
          <h2>{form.id ? 'Editar sesión' : 'Nueva sesión'}</h2>

          <form onSubmit={submit}>
            <div className="row">
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option>Entreno</option>
                <option>Partido</option>
              </select>

              <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Título *" />
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
              <input type="number" min="0" max="600" value={form.minutes} onChange={(e) => set('minutes', e.target.value)} placeholder="Minutos" />
            </div>

            <div style={{ marginTop: 10 }}>
              <textarea rows="3" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notas" />
            </div>

            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn" type="submit">{form.id ? 'Guardar' : 'Añadir'}</button>
              {form.id && <button className="btn ghost" type="button" onClick={() => setForm(empty)}>Cancelar</button>}
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Listado</h2>

          <div className="row">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." />
            <span className="pill">Mostrando: {sorted.length}</span>
          </div>

          <div className="list" style={{ marginTop: 12 }}>
            {sorted.map(s => (
              <div className="item" key={s.id}>
                <div>
                  <div className="title">{s.type}: {s.title}</div>
                  <div className="meta">
                    {s.date ? `📅 ${s.date}` : '📅 sin fecha'}
                    {s.minutes !== '' ? ` · ⏱️ ${s.minutes} min` : ''}
                    {s.notes ? ` · 📝 ${s.notes}` : ''}
                  </div>
                </div>
                <div className="row">
                  <button className="btn ghost" type="button" onClick={() => edit(s)}>Editar</button>
                  <button className="btn ghost" type="button" onClick={() => remove(s.id)}>Borrar</button>
                </div>
              </div>
            ))}
            {sorted.length === 0 && <p className="muted">No hay sesiones.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
