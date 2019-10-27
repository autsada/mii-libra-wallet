import { useEffect, useContext } from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { RECEIVED_COINS_NOTIFIER } from '../apolloClient/subscription'
import { EventsContext, QueryContext } from '../hooks'
import {
  getLocalAccount,
  saveLocalAccount,
  getLocalEvents,
  saveLocalEvents
} from '../helpers/getLocalStorageData'

const ReceivedCoinsMessage = ({ address }) => {
  const { getEvents } = useContext(EventsContext)
  const { setState } = useContext(QueryContext)

  const { data } = useSubscription(RECEIVED_COINS_NOTIFIER, {
    variables: { receiverAddress: address }
  })

  useEffect(() => {
    if (
      data &&
      data.receivedCoins &&
      data.receivedCoins.signed_transaction &&
      data.receivedCoins.signed_transaction.signed_txn
    ) {
      const {
        version,
        signed_transaction: {
          signed_txn: { amount, expiration_time, from_account, to_account }
        }
      } = data.receivedCoins

      const userState = getLocalAccount()

      // Update state
      if (userState) {
        userState.balance = +userState.balance + +amount
      }
      saveLocalAccount(userState)
      setState(userState)

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

      // const oldEvents = JSON.parse(localStorage.getItem('Events'))
      const oldEvents = getLocalEvents() || []
      const newEvents = [newEvent, ...oldEvents]
      saveLocalEvents(newEvents)
      getEvents()
    }
  }, [data])

  return null
}

export default ReceivedCoinsMessage
