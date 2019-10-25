import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { QueryContext } from '../hooks'

const AccountDiv = styled.div`
  width: 100%;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 2rem;

  @media ${props => props.theme.sm} {
    margin-bottom: 3rem;
    width: 80%;
  }
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
`

const Account = () => {
  const { accountState, getState } = useContext(QueryContext)

  useEffect(() => {
    getState()
  }, [accountState, getState])

  return (
    <>
      {accountState && (
        <AccountDiv>
          <div className='address'>
            <p>{accountState && accountState.address}</p>
          </div>

          <div className='balance'>
            {accountState && accountState.balance && (
              <div>Balance: {accountState.balance / 1000000}</div>
            )}
            <img src='/assets/libra-coin.png' width='30' alt='libra' />
          </div>
        </AccountDiv>
      )}
    </>
  )
}

export default Account
