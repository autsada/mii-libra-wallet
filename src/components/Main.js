import React, { useContext, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
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
    margin-top: 0;
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

  const { data } = useQuery(QUERY_BY_ADDRESS, {
    variables: {
      address: accountState ? accountState.address : ''
    }
  })

  const [createAccount, { loading, error }] = useMutation(CREATE_ACCOUNT)

  useEffect(() => {
    const account = JSON.parse(localStorage.getItem('User'))
    // Update context
    setState(account)

    // First case: already have account in localStorage whether it is already in testnet system or not
    if (account) {
      // If the account is already in the testnet system, so we will find its state and update the locatStorage data due to the lastest state from testnet
      if (
        data &&
        data.queryByAddress &&
        data.queryByAddress.response_items &&
        data.queryByAddress.response_items[0] &&
        data.queryByAddress.response_items[0].get_account_state_response
      ) {
        const {
          account_state_with_proof: {
            blob: {
              blob: { balance, sequence_number }
            }
          }
        } = data.queryByAddress.response_items[0].get_account_state_response
        const updatedUser = {
          ...account,
          balance: balance || 0,
          sequenceNumber: sequence_number
        }

        // Update context
        setState(updatedUser)

        // Update localStorage
        saveLocalAccount(updatedUser)
      }
    }
    // Second case: no account in local storage yet, so we need to create one.
    else {
      const createUser = async () => {
        try {
          const user = await createAccount()

          if (user) {
            const {
              data: { createAccount }
            } = user
            const updatedUser = { ...createAccount }

            // Update context
            setState(updatedUser)

            // Update localStorage
            saveLocalAccount(updatedUser)
          }
        } catch (err) {
          console.log(err)
        }
      }
      createUser()

      // Clear events in local storage if any
      localStorage.removeItem('Events')
    }
  }, [data])

  return (
    <MainDiv>
      <Head />
      <div className='account'>
        {(!accountState || loading) && <Loader />}

        {error && <p>Ooobs, something went wrong in creating account.</p>}

        {accountState && !error && <Account />}
      </div>
      <div className='action-button' onClick={startSendCoins}>
        <div className='button-text'>Send Coins</div>
      </div>

      <div className='action-button' onClick={toggleShowEvents}>
        <div className='button-text'>Activities</div>
      </div>

      {showEvents && <EventsList />}

      <div>
        <ReceivedCoinsMessage address={accountState && accountState.address} />
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
