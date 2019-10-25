import React, { useContext, useEffect, useState } from 'react'
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import { ActivityContext, QueryContext } from '../hooks'
import { CREATE_ACCOUNT, MINT_COINS } from '../apolloClient/mutation'
import { QUERY_BY_ADDRESS, QUERY_RECEIVED_EVENTS } from '../apolloClient/query'
import Account from './Account'
import Head from './Head'
import Loader from './Loader'
import EventsList from './EventsList'
import ReceivedCoinsMessage from './ReceivedCoinsMessage'
import {
  saveLocalAccount,
  getLocalEvents,
  saveLocalEvents
} from '../helpers/getLocalStorageData'

const MainDiv = styled.div`
  width: 50%;
  height: auto;
  background: ${props => props.theme.white};
  margin: 0 auto;
  color: ${props => props.theme.black};
  border: 1px solid ${props => props.theme.grey};
  border-radius: ${props => props.theme.shape.borderRadius * 2}px;
  padding: 0;
  padding-bottom: 3rem;
  /* position: relative; */

  @media ${props => props.theme.lg} {
    width: 70%;
    margin-top: 2rem;
  }

  @media ${props => props.theme.md} {
    width: 70%;
    margin-top: 2rem;
  }

  @media ${props => props.theme.sm} {
    width: 100%;
    margin-top: 0;
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

  .action-button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: white;
    width: 80%;
    height: 5rem;
    margin: 0 auto;
    margin-bottom: 1rem;
    border-radius: 4px;
    cursor: pointer;
    background: ${props => props.theme.libraBlue};
    transition: background-color ${props => props.theme.transitionDuration}
      ease-in;

    &:hover {
      background: ${props => props.theme.darkBlue};
    }

    @media ${props => props.theme.sm} {
      height: 4rem;
      width: 80%;
    }

    .button-text {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      color: white;
      border-radius: 0 4px 4px 0;
      transition: background-color ${props => props.theme.transitionDuration}
        ease-in;

      @media ${props => props.theme.md} {
        font-size: 1.8rem;
      }

      @media ${props => props.theme.sm} {
        font-size: 1.4rem;
      }
    }
  }
`

const Main = ({ account }) => {
  const { startSendCoins, showEvents, toggleShowEvents } = useContext(
    ActivityContext
  )
  const { getState } = useContext(QueryContext)
  const [user, setUser] = useState(null)
  const [createAcError, setCreateAcError] = useState(false)
  const [newTxnVersion, setNewTxnVersion] = useState(null)

  const client = useApolloClient()
  const { data } = useQuery(QUERY_BY_ADDRESS, {
    variables: {
      address: (account && account.address) || (user && user.address)
    }
  })

  const receivedEvents = useQuery(QUERY_RECEIVED_EVENTS, {
    variables: {
      address: (account && account.address) || ((user && user.address) || '')
    }
  })

  const [createAccount] = useMutation(CREATE_ACCOUNT)
  const [mintCoin, { loading, error }] = useMutation(MINT_COINS, {
    variables: {
      amount: 1000,
      address: account ? account.address : user ? user.address : ''
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
      const updatedUser = {
        ...user,
        balance,
        sequenceNumber: sequence_number
      }

      saveLocalAccount(updatedUser)
      getState()

      client.writeData({
        data: {
          user: updatedUser
        }
      })
    },
    refetchQueries: [
      {
        query: QUERY_BY_ADDRESS,
        variables: {
          address: (account && account.address) || (user && user.address)
        }
      },
      {
        query: QUERY_RECEIVED_EVENTS,
        variables: {
          address: (account && account.address) || (user && user.address)
        }
      }
    ]
  })

  useEffect(() => {
    if (!account) {
      // If no data or no data.user, it means this is the first time user visit the wallet so we create account for them automatically
      const createUser = async () => {
        try {
          const user = await createAccount()
          setUser({ ...user.data.createAccount })
        } catch (error) {
          setCreateAcError(true)
        }
      }
      createUser().then(() => {
        mintCoin()
      })
    }

    // localStorage.removeItem('User')
    // localStorage.removeItem('Events')
    // localStorage.removeItem('Messages')
    // client.writeData({ data: { user: null } })
    // client.writeData({ data: { events: null } })
  }, [account, createAccount, mintCoin])

  useEffect(() => {
    // Mint coins once user has coins less than 50
    if (account && data && data.user && data.user.balance < 50) {
      mintCoin()
    }
  }, [data, account, mintCoin])

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
          toAccount: (account && account.address) || (user && user.address),
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
  }, [newTxnVersion, receivedEvents, account, user])

  // Pass user object to Account component depending on what source of data the user is from (if user was already in localStorage, we pass data.user, if not we pass user from useState)
  return (
    <MainDiv>
      <Head />
      {((!account && !user) || loading) && <Loader />}

      {createAcError ||
        (error && (
          <p>Ooobs..., something went wrong. Please refresh the page.</p>
        ))}

      {(account || user) && !loading && <Account />}

      {/* {data &&
        data.queryByAddress &&
        data.queryByAddress.response_items[0] &&
        data.queryByAddress.response_items[0].get_account_state_response && (
          <Account
            user={account ? account : user ? user : null}
            balance={
              data &&
              data.queryByAddress &&
              data.queryByAddress.response_items[0] &&
              data.queryByAddress.response_items[0]
                .get_account_state_response &&
              data.queryByAddress.response_items[0].get_account_state_response
                .account_state_with_proof &&
              data.queryByAddress.response_items[0].get_account_state_response
                .account_state_with_proof.blob.blob.balance
            }
          />
        )} */}

      {/* {data && data.user && data.user.balance && (
        <Account
          user={account ? account : user ? user : null}
          balance={data && data.user && data.user.balance}
        />
      )} */}

      <div className='qr-code'>
        {((account && account.address) || (user && user.address)) && (
          <QRCode
            value={account ? account.address : user ? user.address : null}
            size={150}
          />
        )}
      </div>

      <div className='action-button' onClick={startSendCoins}>
        <div className='button-text'>Send Coins</div>
      </div>

      <div className='action-button' onClick={toggleShowEvents}>
        <div className='button-text'>Activities</div>
      </div>
      {showEvents && <EventsList />}

      <div>
        <ReceivedCoinsMessage
          address={(account && account.address) || (user && user.address)}
        />
      </div>
    </MainDiv>
  )
}

export default Main
// 75df80184b14dc905a75c256eab041c9f8b1bb906a7756f6338f40f068007b36
// 09c60fea0b7a7205ebf9fd0e62c2949af07553e01856b73fc21c12041163eff7
// 1b764673cc4f62078f0ade9007b6855a15fb588d94342ea313f9995c94c49b38
// 64ae60f1d14446326cc91b040d990d308f3c8e16645cad73d37ab9420744ccaa
// fb0331d233fd1b2754aeba880d295690f3f100eb28c6a1a096e2355b75a118b5
