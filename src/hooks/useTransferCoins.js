import { useContext } from 'react'
import { useApolloClient, useMutation } from '@apollo/react-hooks'

import { TRANSFER_COINS } from '../apolloClient/mutation'
import {
  GET_CURRENT_USER,
  QUERY_BY_ADDRESS,
  QUERY_RECEIVED_EVENTS,
  QUERY_SENT_EVENTS
} from '../apolloClient/query'
import {
  ActivityContext,
  QueryContext,
  QrCodeContext,
  ManualTransferContext
} from '../hooks'
import { saveLocalAccount } from '../helpers/getLocalStorageData'

export const useTransferCoins = ({
  accountState,
  receiver,
  transferAmount
}) => {
  const { cancelManual } = useContext(ActivityContext)
  const { setState } = useContext(QueryContext)
  const { clearQrValue } = useContext(QrCodeContext)
  const { clearTransferInputs } = useContext(ManualTransferContext)

  const [transferMoney, { loading, error }] = useMutation(TRANSFER_COINS, {
    variables: {
      fromAddress: accountState && accountState.address,
      sequenceNumber: accountState && accountState.sequenceNumber,
      toAddress: receiver,
      amount: transferAmount,
      secretKey: accountState && accountState.secretKey
    },
    update(
      cache,
      {
        data: { transferMoney }
      }
    ) {
      const {
        transaction: {
          transaction: { sequence_number, amount }
        }
      } = transferMoney

      const updatedState = accountState && {
        ...accountState,
        balance: (+accountState.balance - amount).toString(),
        sequenceNumber: sequence_number + 1
      }

      // Update user
      saveLocalAccount(updatedState)
      setState(updatedState)
      cache.writeData({
        data: {
          user: updatedState
        }
      })
    },
    onCompleted() {
      clearTransferInputs()
      clearQrValue()
      cancelManual()
    },
    refetchQueries: [
      {
        query: GET_CURRENT_USER
      },
      {
        query: QUERY_BY_ADDRESS,
        variables: {
          address: accountState && accountState.address
        }
      },
      {
        query: QUERY_RECEIVED_EVENTS,
        variables: {
          address: accountState && accountState.address
        }
      },
      {
        query: QUERY_SENT_EVENTS,
        variables: {
          address: accountState && accountState.address
        }
      }
    ]
  })

  return { transferMoney, loading, error }
}
