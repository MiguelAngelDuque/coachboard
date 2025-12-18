import { useState } from 'react'
import { uid } from '../lib/store.js'

export default function Players({ store, setStore }) {
  const [name, setName] = useState('')

  function addPlayer(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return
    setStore({
      ...store,
      players: [{ id: uid(), name: clean }, ...store.players],
    })
    setName('')
  }

  function removePlayer(id) {
    setStore({
      ...store,
      players: store.players.filter(p => p.id !== id),
    })
  }

  return (
    <div className="container main">
      <h1>Jugadores</h1>

      <div className="card">
        <form className="row" onSubmit={addPlayer}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del jugador" />
          <button className="btn" type="submit">Añadir</button>
        </form>

        <div className="list">
          {store.players.map(p => (
            <div className="item" key={p.id}>
              <div>
                <div className="title">{p.name}</div>
                <div className="meta">ID: {p.id}</div>
              </div>
              <div className="row">
                <button className="small" onClick={() => removePlayer(p.id)}>Borrar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
