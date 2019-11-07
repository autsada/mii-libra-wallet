import { useContext, useState, useEffect } from 'react'
import { useApolloClient, useMutation } from '@apollo/react-hooks'

import { CREATE_ACCOUNT } from '../apolloClient/mutation'
import { QueryContext } from './queryContext'
import { saveLocalAccount } from '../helpers/getLocalStorageData'

export const useCreateAccount = () => {
  const { setState } = useContext(QueryContext)
  const [createAccountLoading, setCreateAccountLoading] = useState(null)
  const [createAccountError, setCreateAccountError] = useState(null)

  // const client = useApolloClient()

  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT, {
    onCompleted({ createAccount }) {
      if (createAccount) {
        const newAccount = {
          ...createAccount,
          balance: 0,
          sequenceNumber: undefined
        }

        // Update context
        setState(newAccount)

        // Confirm that the state is check
        // setCheckState(true)

        // Update localStorage
        saveLocalAccount(newAccount)

        // Update cache
        // client.writeData({
        //   data: {
        //     user: newAccount
        //   }
        // })
      }
    }
  })

  useEffect(() => {
    if (loading) {
      setCreateAccountLoading(true)
    } else {
      setCreateAccountLoading(false)
    }
  }, [loading])

  useEffect(() => {
    if (error) {
      setCreateAccountError(true)
    } else {
      setCreateAccountError(false)
    }
  }, [error])

  return {
    createAccount,
    createAccountLoading,
    createAccountError
  }
}
