import React, { useEffect, useContext } from 'react'
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
  const { getState } = useContext(QueryContext)

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

      const user = getLocalAccount()

      // Update user
      if (user) {
        user.balance = +user.balance + +amount
      }
      saveLocalAccount(user)
      getState()

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

  // useEffect(() => {
  //   console.log('Effect run -->')
  //   if (data && data.receivedCoins) {
  //     const {
  //       version,
  //       signed_transaction: {
  //         signed_txn: { amount, from_account, to_account, expiration_time }
  //       }
  //     } = data.receivedCoins
  //     console.log(data.receivedCoins)

  //     // Get events and messages from localStorage, if null, initialize with []
  //     const oldEventsList = JSON.parse(localStorage.getItem('Events')) || []
  //     const oldMessagesList = JSON.parse(localStorage.getItem('Messages')) || []
  //     console.log('Events-->', oldEventsList)
  //     console.log('Messages', oldMessagesList)

  //     const newEvent = {
  //       transaction_version: version,
  //       sequenceNumber: 'n/a',
  //       amount,
  //       toAccount: to_account,
  //       fromAccount: from_account,
  //       date: expiration_time,
  //       event_type: 'received'
  //     }
  //     const newEventsList = [newEvent, ...oldEventsList]
  //     localStorage.removeItem('Events')
  //     localStorage.setItem('Events', JSON.stringify(newEventsList))

  //     const newMessage = {
  //       from: from_account,
  //       amount,
  //       date: expiration_time
  //     }
  //     const newMessagesList = [newMessage, ...oldMessagesList]
  //     localStorage.removeItem('Messages')
  //     localStorage.setItem('Messages', JSON.stringify(newMessagesList))

  //     getEvents()
  //   }
  // }, data)

  return null
}

export default ReceivedCoinsMessage
