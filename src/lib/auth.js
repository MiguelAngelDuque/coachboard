const KEY = 'coachboard_user_v0'
export const getUser = () => localStorage.getItem(KEY) || ''
export const setUser = (name) => localStorage.setItem(KEY, name)
export const clearUser = () => localStorage.removeItem(KEY)
