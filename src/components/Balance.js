import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'

import { QueryContext, useMintCoins, useQueryState } from '../hooks'
import Loader from './Loader'

const BalanceDiv = styled.div`
  font-size: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.libraBlue};
`

const Balance = () => {
  const { accountState } = useContext(QueryContext)
  const { checkState } = useQueryState(accountState)

  const { mintCoin, loading, error } = useMintCoins(accountState)

  useEffect(() => {
    if (checkState) {
      if (
        accountState &&
        accountState.address &&
        (!accountState.balance || +accountState.balance < 50)
      ) {
        console.log('Mint coin 2')
        mintCoin()
      }
    }
  }, [accountState, checkState, mintCoin])

  return (
    <BalanceDiv>
      {error && <p>Error in minting coins, please try again later.</p>}

      {loading && <Loader />}

      {!error && !loading && (
        <>
          <NumberFormat
            value={accountState.balance / 1000000}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'Lib: '}
            renderText={value => <span>{value}</span>}
          />
          <img src='/assets/libra-coin.png' width='30' alt='libra' />
        </>
      )}
    </BalanceDiv>
  )
}

export default Balance