export const STORE_KEY = 'coachboard_store_v0'

export function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function defaultStore() {
  return {
    players: [{ id: 'p1', name: 'Jugador 1' }],
    sessions: [{ id: 's1', type: 'Entreno', title: 'Fuerza pierna', date: '', minutes: 60, notes: '' }],
    matches: [{ id: 'm1', opponent: 'Rival FC', date: '', location: 'Valencia', homeAway: 'Casa', callup: ['p1'], notes: '' }],
  }
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    const data = raw ? JSON.parse(raw) : null
    return normalizeStore(data)
  } catch {
    return defaultStore()
  }
}


export function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
}

export function normalizeStore(raw) {
  const base = defaultStore()
  const r = raw && typeof raw === 'object' ? raw : {}

  const players = Array.isArray(r.players) ? r.players : base.players
  const sessions = Array.isArray(r.sessions) ? r.sessions : base.sessions
  const matches = Array.isArray(r.matches) ? r.matches : base.matches

  return {
    players: players.map(p => ({
      id: p?.id || uid(),
      name: String(p?.name || '').trim() || 'Jugador',
    })),

    sessions: sessions.map(s => ({
      id: s?.id || uid(),
      type: s?.type === 'Partido' ? 'Partido' : 'Entreno',
      title: String(s?.title || '').trim() || 'Sesión',
      date: String(s?.date || ''),
      minutes: (s?.minutes === '' || s?.minutes == null) ? '' : Number(s.minutes) || 0,
      notes: String(s?.notes || ''),
    })),

    matches: matches.map(m => ({
      id: m?.id || uid(),
      opponent: String(m?.opponent || '').trim() || 'Rival',
      date: String(m?.date || ''),
      location: String(m?.location || ''),
      homeAway: (m?.homeAway === 'Fuera') ? 'Fuera' : 'Casa',
      callup: Array.from(new Set(Array.isArray(m?.callup) ? m.callup : [])),
      notes: String(m?.notes || ''),
    })),
  }
}
