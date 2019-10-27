import React, { createContext, useState } from 'react'

export const QueryContext = createContext()

export const QueryProvider = ({ children }) => {
  const [accountState, setAccountState] = useState(null)

  const setState = state => {
    setAccountState(state)
  }

  return (
    <QueryContext.Provider value={{ accountState, setState }}>
      {children}
    </QueryContext.Provider>
  )
}
