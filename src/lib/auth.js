const KEY = 'coachboard_user_v0'

export function getUser() {
  return localStorage.getItem(KEY) || ''
}

export function setUser(name) {
  localStorage.setItem(KEY, name)
}

export function clearUser() {
  localStorage.removeItem(KEY)
}
