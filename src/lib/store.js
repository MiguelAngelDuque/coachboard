const KEY = 'coachboard_store_v0'

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
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : null
    return data ? { ...defaultStore(), ...data } : defaultStore()
  } catch {
    return defaultStore()
  }
}

export function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store))
}
