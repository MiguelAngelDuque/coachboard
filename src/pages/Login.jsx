import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUser } from '../lib/auth.js'

export default function Login() {
  const [name, setName] = useState('Miguel')
  const navigate = useNavigate()

  function onSubmit(e) {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return
    setUser(clean)
    navigate('/', { replace: true })
  }

  return (
    <div className="container main">
      <div className="card">
        <h1>CoachBoard</h1>
        <p className="muted">Login mock (solo para demo). Guarda el usuario en LocalStorage.</p>

        <form className="row" onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          <button className="btn" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
