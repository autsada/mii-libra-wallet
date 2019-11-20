import React, { createContext, useState } from "react"

import { getLocalAccount } from "../../helpers/getLocalStorageData"

export const QueryContext = createContext()

let account = getLocalAccount()

if (account && account.address && account.secretKey && !account.mnemonic) {
  localStorage.removeItem("User")
  account = null
}

export const StateProvider = ({ children }) => {
  const [accountState, setAccountState] = useState(account)

  const setState = state => {
    setAccountState(state)
  }

  return (
    <QueryContext.Provider value={{ accountState, setState }}>
      {children}
    </QueryContext.Provider>
  )
}
