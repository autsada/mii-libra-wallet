import React, { useContext, useEffect, useState } from 'react'
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import { QueryContext } from '../hooks'
import { MINT_COINS } from '../apolloClient/mutation'
import { QUERY_RECEIVED_EVENTS } from '../apolloClient/query'
import {
  saveLocalAccount,
  getLocalEvents,
  saveLocalEvents
} from '../helpers/getLocalStorageData'

const AccountDiv = styled.div`
  .address {
    font-size: 1.1rem;
    color: ${props => props.theme.grey};
    margin-bottom: 2rem;

    p {
      word-wrap: break-word;
    }
  }

  .balance {
    font-size: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.libraBlue};
  }

  .qr-code {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem auto;

    @media ${props => props.theme.sm} {
      width: 60%;
    }
  }
`

const Account = () => {
  const { accountState, setState } = useContext(QueryContext)
  const [newTxnVersion, setNewTxnVersion] = useState(null)

  const client = useApolloClient()

  const receivedEvents = useQuery(QUERY_RECEIVED_EVENTS, {
    variables: {
      address: accountState && accountState.address
    }
  })

  const [mintCoin, { loading, error }] = useMutation(MINT_COINS, {
    variables: {
      amount: 1000,
      address: accountState && accountState.address
    },
    onCompleted({ mintCoin }) {
      const {
        blob: {
          blob: { balance, sequence_number }
        }
      } = mintCoin.response_items[0].get_account_state_response.account_state_with_proof

      const {
        version
      } = mintCoin.response_items[0].get_account_state_response.account_state_with_proof
      setNewTxnVersion(version)

      const updatedState = {
        ...accountState,
        balance,
        sequenceNumber: sequence_number
      }

      // Update context
      setState(updatedState)

      // Update localStorage
      saveLocalAccount(updatedState)

      // Update cache
      client.writeData({
        data: {
          user: updatedState
        }
      })
    },
    refetchQueries: [
      {
        query: QUERY_RECEIVED_EVENTS,
        variables: {
          address: accountState && accountState.address
        }
      }
    ]
  })

  useEffect(() => {
    if (accountState && (!accountState.balance || +accountState.balance < 50)) {
      mintCoin()
    }
  }, [accountState])

  useEffect(() => {
    if (
      newTxnVersion &&
      receivedEvents &&
      receivedEvents.data &&
      receivedEvents.data.queryReceivedEvents &&
      receivedEvents.data.queryReceivedEvents.length > 0
    ) {
      const newEvent = receivedEvents.data.queryReceivedEvents.find(
        event => event.transaction_version === newTxnVersion
      )

      if (newEvent) {
        const {
          transaction_version,
          event: {
            sequence_number,
            event_data: { address, amount }
          }
        } = newEvent

        const storedEvent = {
          transaction_version,
          sequenceNumber: sequence_number,
          fromAccount: address,
          toAccount: accountState && accountState.address,
          amount,
          date: Date.now().toString(),
          event_type: 'mint'
        }

        // Get events from localStorage, if null, initialize with []
        const oldEventsList = getLocalEvents() || []

        const newEventsList = [storedEvent, ...oldEventsList]

        saveLocalEvents(newEventsList)
      }
    }
  }, [newTxnVersion, receivedEvents])

  return (
    <AccountDiv>
      {error && <p>Ooobs, something went wrong in minting coins.</p>}

      {accountState && !error && (
        <>
          <div className='address'>
            <p>{accountState && accountState.address}</p>
          </div>

          <div className='balance'>
            {accountState && !loading && accountState.balance && (
              <>
                <div>Balance: {accountState.balance / 1000000}</div>
                <img src='/assets/libra-coin.png' width='30' alt='libra' />
              </>
            )}

            {loading && <p>Minting coins ...</p>}
          </div>

          <div className='qr-code'>
            <QRCode value={accountState && accountState.address} size={150} />
          </div>
        </>
      )}
    </AccountDiv>
  )
}

export default Account
