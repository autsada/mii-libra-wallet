import React, { useContext, useEffect, useState } from 'react'
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import { ActivityContext, QueryContext } from '../hooks'
import { CREATE_ACCOUNT } from '../apolloClient/mutation'
import { QUERY_BY_ADDRESS } from '../apolloClient/query'
import Head from './Head'
import Loader from './Loader'
import EventsList from './EventsList'
import ReceivedCoinsMessage from './ReceivedCoinsMessage'
import { saveLocalAccount } from '../helpers/getLocalStorageData'
import Account from './Account'

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
    height: 100vh;
    margin: 0;
  }

  .account {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    /* margin-bottom: 2rem; */

    @media ${props => props.theme.sm} {
      margin-bottom: 3rem;
      width: 80%;
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

// const Account = React.lazy(() => import('./Account'))

const Main = () => {
  const { startSendCoins, showEvents, toggleShowEvents } = useContext(
    ActivityContext
  )
  const { accountState, setState } = useContext(QueryContext)
  const [checkState, setCheckState] = useState(false)

  const client = useApolloClient()

  const queryAccount = useQuery(QUERY_BY_ADDRESS, {
    variables: {
      address: (accountState && accountState.address) || ''
    }
  })

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
        setCheckState(true)

        // Update localStorage
        saveLocalAccount(newAccount)

        // Update cache
        client.writeData({
          data: {
            user: newAccount
          }
        })
      }
    }
  })

  useEffect(() => {
    localStorage.removeItem('User')
    localStorage.removeItem('Events')
  })

  // useEffect(() => {
  //   // First case: already have account in localStorage whether it is already in testnet system or not
  //   if (accountState && accountState.address) {
  //     const getLatestState = () => {
  //       return new Promise((resolve, reject) => {
  //         let callCount = 0

  //         const query = setInterval(() => {
  //           callCount++

  //           if (queryAccount && queryAccount.data) {
  //             const { data } = queryAccount
  //             if (
  //               data &&
  //               data.queryByAddress &&
  //               data.queryByAddress.response_items &&
  //               data.queryByAddress.response_items[0] &&
  //               data.queryByAddress.response_items[0].get_account_state_response
  //             ) {
  //               resolve(
  //                 data.queryByAddress.response_items[0]
  //                   .get_account_state_response
  //               )
  //               clearInterval(query)
  //             }

  //             if (queryAccount && queryAccount.error) {
  //               clearInterval(query)
  //               reject(queryAccount.error)
  //             }

  //             if (callCount > 10 && queryAccount && !queryAccount.data) {
  //               clearInterval(query)
  //               reject('Account does not exists')
  //             }
  //           }
  //         }, 200)
  //       })
  //     }

  //     const getState = async () => {
  //       try {
  //         const state = await getLatestState()

  //         if (state) {
  //           // Found state in testnet system
  //           const {
  //             blob: {
  //               blob: { balance, sequence_number }
  //             }
  //           } = state.account_state_with_proof

  //           const updatedUser = {
  //             ...accountState,
  //             balance: balance || 0,
  //             sequenceNumber: sequence_number
  //           }

  //           // Update context
  //           setState(updatedUser)

  //           // Confirm that the state is check
  //           setCheckState(true)

  //           // Update localStorage
  //           saveLocalAccount(updatedUser)

  //           // Update cache
  //           client.writeData({
  //             data: {
  //               user: updatedUser
  //             }
  //           })
  //         } else {
  //           // Account does not exist in the testnet system
  //           const resetAccount = {
  //             ...accountState,
  //             balance: 0,
  //             sequenceNumber: undefined
  //           }
  //           // Update context
  //           setState(resetAccount)

  //           // Confirm that the state is check
  //           setCheckState(true)

  //           // Update localStorage
  //           saveLocalAccount(resetAccount)

  //           // Update cache
  //           client.writeData({
  //             data: {
  //               user: resetAccount
  //             }
  //           })
  //         }
  //       } catch (error) {
  //         // Account does not exist in the testnet system
  //         const resetAccount = {
  //           ...accountState,
  //           balance: 0,
  //           sequenceNumber: undefined
  //         }
  //         // Update context
  //         setState(resetAccount)

  //         // Confirm that the state is check
  //         setCheckState(true)

  //         // Update localStorage
  //         saveLocalAccount(resetAccount)

  //         // Update cache
  //         client.writeData({
  //           data: {
  //             user: resetAccount
  //           }
  //         })
  //       }
  //     }
  //     getState()
  //   }
  //   // Second case: no account in local storage yet, so we need to create one.
  //   else {
  //     const createUser = async () => {
  //       try {
  //         await createAccount()
  //       } catch (err) {
  //         console.log(err)
  //       }
  //     }
  //     createUser()

  //     // Clear events in local storage if any
  //     localStorage.removeItem('Events')
  //   }
  // }, [queryAccount && queryAccount.data, client])

  return (
    <MainDiv>
      <Head />
      <div className='account'>
        {!accountState || (!accountState.address && loading && <Loader />)}

        {error && <p>Ooobs, something went wrong in creating account.</p>}

        <Account checkState={checkState} />
      </div>
      <div className='action-button' onClick={startSendCoins}>
        <div className='button-text'>Send Coins</div>
      </div>

      <div className='action-button' onClick={toggleShowEvents}>
        <div className='button-text'>Activities</div>
      </div>

      {showEvents && <EventsList />}

      {accountState && <ReceivedCoinsMessage />}
    </MainDiv>
  )
}

export default Main
