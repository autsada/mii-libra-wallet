import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import NumberFormat from 'react-number-format'

import { QueryContext, useMintCoins } from '../hooks'
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

const Account = ({ checkState }) => {
  const { accountState } = useContext(QueryContext)
  const { mintCoin, loading, error } = useMintCoins(accountState)

  useEffect(() => {
    if (checkState) {
      if (
        accountState &&
        accountState.address &&
        (!accountState.balance || +accountState.balance < 50)
      ) {
        mintCoin()
      }
    }
  }, [accountState, checkState, mintCoin])

  return (
    <AccountDiv>
      {(!accountState || !accountState.address || loading) && <Loader />}

      {error && <p>Ooobs, something went wrong in minting coins.</p>}

      {accountState && accountState.address && !loading && !error && (
        <>
          <div className='address'>
            <p>{accountState && accountState.address}</p>
          </div>

          <div className='balance'>
            <NumberFormat
              value={accountState.balance / 1000000}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'Lib: '}
              renderText={value => <span>{value}</span>}
            />
            <img src='/assets/libra-coin.png' width='30' alt='libra' />
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
