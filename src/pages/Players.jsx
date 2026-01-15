import { useState } from 'react'
import { uid } from '../lib/store.js'

export default function Players({ store, setStore }) {
  const [name, setName] = useState('')
  const players = store.players || []

  function add(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return

    const exists = players.some(p => (p.name || '').trim().toLowerCase() === clean.toLowerCase())
    if (exists) {
      alert("Ese jugador ya existe.")
      return
    }


  function remove(id) {
    setStore({ ...store, players: players.filter(p => p.id !== id) })
  }

  return (
    <div className="container main">
      <h1>Jugadores</h1>

      <div className="card">
        <form className="row" onSubmit={add}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del jugador" />
          <button className="btn" type="submit">Añadir</button>
        </form>

        <div className="list" style={{ marginTop: 12 }}>
          {players.map(p => (
            <div className="item" key={p.id}>
              <div>
                <div className="title">{p.name}</div>
                <div className="meta">ID: {p.id}</div>
              </div>
              <div className="row">
                <button className="btn ghost" type="button" onClick={() => remove(p.id)}>Borrar</button>
              </div>
            </div>
          ))}
          {players.length === 0 && <p className="muted">No hay jugadores.</p>}
        </div>
      </div>
    </div>
  )
}
}
