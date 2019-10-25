import React, { createContext, useState } from 'react'

export const QueryContext = createContext()

export const QueryProvider = ({ children }) => {
  const [accountState, setAccountState] = useState(null)
  const getState = () => {
    const user = JSON.parse(localStorage.getItem('User'))
    setAccountState(user)
  }

  return (
    <QueryContext.Provider value={{ accountState, getState }}>
      {children}
    </QueryContext.Provider>
  )
}
