const KEY = 'coachboard_store_v0'

export function loadStore() {
  try {
    const raw = localStorage.getItem(KEY)
    const data = raw ? JSON.parse(raw) : null
    if (!data) return defaultStore()
    return { ...defaultStore(), ...data }
  } catch {
    return defaultStore()
  }
}

export function saveStore(store) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function defaultStore() {
  return {
    players: [
      { id: 'p1', name: 'Jugador 1' },
      { id: 'p2', name: 'Jugador 2' },
    ],
    sessions: [
      { id: 's1', type: 'Entreno', title: 'Fuerza pierna', date: '', minutes: 60, notes: 'Core al final' },
      { id: 's2', type: 'Partido', title: 'Liga - Jornada', date: '', minutes: 90, notes: '' },
    ],
    matches: [
      { id: 'm1', opponent: 'Rival FC', date: '', location: 'Valencia', homeAway: 'Casa', callup: ['p1'], notes: '' },
    ],
  }
}


export function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}
