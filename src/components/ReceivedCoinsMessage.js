import { useEffect, useContext } from 'react'
import { useApolloClient, useSubscription, useQuery } from '@apollo/react-hooks'

import { RECEIVED_COINS_NOTIFIER } from '../apolloClient/subscription'
import { GET_EVENTS } from '../apolloClient/query'
import { QueryContext } from '../hooks'
import {
  saveLocalAccount,
  saveLocalEvents
} from '../helpers/getLocalStorageData'

const ReceivedCoinsMessage = () => {
  const { accountState, setState } = useContext(QueryContext)

  const client = useApolloClient()

  const {
    data: { events }
  } = useQuery(GET_EVENTS)

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
        version,
        transaction: {
          transaction: { amount, expiration_time, from_account, to_account }
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

      // Update event
      const newEvent = {
        date: expiration_time,
        amount,
        event_type: 'received',
        fromAccount: from_account,
        sequenceNumber: 'n/a',
        toAccount: to_account,
        transaction_version: version
      }

      const newEvents = [newEvent, ...events]
      saveLocalEvents(newEvents)

      client.writeData({
        data: {
          events: newEvents
        }
      })
    }
  }, [data])

  return null
}

export default ReceivedCoinsMessage
