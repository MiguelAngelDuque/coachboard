export const AUTH_KEY = 'coachboard_user_v0'

export const getUser = () => localStorage.getItem(AUTH_KEY) || ''
export const setUser = (name) => localStorage.setItem(AUTH_KEY, name)
export const clearUser = () => localStorage.removeItem(AUTH_KEY)
