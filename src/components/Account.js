import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import { QueryContext, useCreateAccount, useQueryState } from '../hooks'
import Balance from './Balance'
import Loader from './Loader'

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
  const { accountState } = useContext(QueryContext)
  const { setCheckState } = useQueryState(accountState)
  const {
    createAccount,
    createAccountLoading,
    createAccountError
  } = useCreateAccount()

  useEffect(() => {
    localStorage.removeItem('Events')
    if (
      !accountState ||
      (accountState && (!accountState.address || !accountState.secretKey))
    ) {
      const createUser = async () => {
        try {
          const res = await createAccount()

          if (res) {
            if (res.data.createAccount.address) {
              setCheckState(true)
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
      createUser()
    }
  }, [])

  return (
    <AccountDiv>
      {(!accountState ||
        (accountState && !accountState.address) ||
        createAccountLoading) && <Loader />}

      {createAccountError && (
        <p>Ooobs, something went wrong in creating account.</p>
      )}

      {accountState &&
        accountState.address &&
        !createAccountLoading &&
        !createAccountError && (
          <div className='address'>
            <p>{accountState && accountState.address}</p>
          </div>
        )}

      {accountState && accountState.address && <Balance />}

      {accountState &&
        accountState.address &&
        !createAccountLoading &&
        !createAccountError && (
          <div className='qr-code'>
            <QRCode value={accountState && accountState.address} size={150} />
          </div>
        )}
    </AccountDiv>
  )
}

export default Account
