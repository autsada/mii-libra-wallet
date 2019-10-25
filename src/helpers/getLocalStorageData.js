export const getLocalAccount = () => JSON.parse(localStorage.getItem('User'))

export const saveLocalAccount = updatedUser => {
  localStorage.removeItem('User')
  localStorage.setItem('User', JSON.stringify(updatedUser))
}

export const getLocalEvents = () => JSON.parse(localStorage.getItem('Events'))

export const saveLocalEvents = newEvents => {
  localStorage.removeItem('Events')
  localStorage.setItem('Events', JSON.stringify(newEvents))
}
