import React, { createContext, useState } from "react"

import { getLocalAccount } from "../../helpers/getLocalStorageData"

export const QueryContext = createContext()

export const StateProvider = ({ children }) => {
  const [accountState, setAccountState] = useState(getLocalAccount())

  const setState = state => {
    setAccountState(state)
  }

  return (
    <QueryContext.Provider value={{ accountState, setState }}>
      {children}
    </QueryContext.Provider>
  )
}
