import { useEffect, useContext } from 'react'
import { useApolloClient, useSubscription } from '@apollo/react-hooks'

import { RECEIVED_COINS_NOTIFIER } from '../apolloClient/subscription'
import { QueryContext } from '../hooks'
import { saveLocalAccount } from '../helpers/getLocalStorageData'

const ReceivedCoinsMessage = () => {
  const { accountState, setState } = useContext(QueryContext)

  const client = useApolloClient()

  const { data } = useSubscription(RECEIVED_COINS_NOTIFIER, {
    variables: { receiverAddress: accountState && accountState.address }
  })

  useEffect(() => {
    if (
      data &&
      data.receivedCoins &&
      data.receivedCoins.transaction &&
      data.receivedCoins.transaction.transaction
    ) {
      const {
        transaction: {
          transaction: { amount }
        }
      } = data.receivedCoins

      const updatedState = {
        ...accountState,
        balance: (+accountState.balance + +amount).toString()
      }

      saveLocalAccount(updatedState)
      setState(updatedState)
      client.writeData({
        data: {
          user: updatedState
        }
      })
    }
  }, [data])

  return null
}

export default ReceivedCoinsMessage
