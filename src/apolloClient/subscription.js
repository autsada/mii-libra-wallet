import gql from 'graphql-tag'

export const RECEIVED_COINS_NOTIFIER = gql`
  subscription RECEIVED_COINS_NOTIFIER($receiverAddress: String!) {
    receivedCoins(receiverAddress: $receiverAddress) {
      version
      signed_transaction {
        signed_txn {
          sequence_number
          amount
          from_account
          to_account
          expiration_time
        }
      }
    }
  }
`
