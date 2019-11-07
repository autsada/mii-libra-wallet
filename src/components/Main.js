import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import {
  ActivityContext,
  QueryContext,
  useCreateAccount,
  useQueryState
} from '../hooks'
import Head from './Head'
import Loader from './Loader'
import EventsList from './EventsList'
import ReceivedCoinsMessage from './ReceivedCoinsMessage'
import Account from './Account'

const MainDiv = styled.div`
  width: 50%;
  height: 100%;
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
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
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
  const { accountState } = useContext(QueryContext)
  const {
    createAccount,
    createAccountLoading,
    createAccountError
  } = useCreateAccount()

  const { checkState, setCheckState } = useQueryState(accountState)

  useEffect(() => {
    localStorage.removeItem('Events')
    if (
      !accountState ||
      (accountState && (!accountState.address || !accountState.secretKey))
    ) {
      const createUser = async () => {
        try {
          createAccount().then(() => setCheckState(true))
        } catch (err) {
          console.log(err)
        }
      }
      createUser()
    }
  }, [accountState])

  return (
    <MainDiv>
      <Head />
      <div className='account'>
        {!accountState ||
          (!accountState.address && createAccountLoading && <Loader />)}

        {createAccountError && (
          <p>Ooobs, something went wrong in creating account.</p>
        )}

        <Account checkState={checkState} />
      </div>
      <div className='action-button' onClick={startSendCoins}>
        <div className='button-text'>Send Coins</div>
      </div>

      <div className='action-button' onClick={toggleShowEvents}>
        <div className='button-text'>Activities</div>
      </div>

      {showEvents && (
        <EventsList address={(accountState && accountState.address) || ''} />
      )}

      {accountState && <ReceivedCoinsMessage />}
    </MainDiv>
  )
}

export default Main
