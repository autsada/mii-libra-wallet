import gql from 'graphql-tag'

export const CREATE_ACCOUNT = gql`
  mutation CREATE_ACCOUNT {
    createAccount {
      address
      secretKey
    }
  }
`

export const MINT_COINS = gql`
  mutation MINT_COINS($amount: Int!, $address: String!) {
    mintCoin(amount: $amount, address: $address) {
      response_items {
        get_account_state_response {
          account_state_with_proof {
            version
            blob {
              blob {
                balance
                sequence_number
              }
            }
          }
        }
      }
    }
  }
`

export const TRANSFER_COINS = gql`
  mutation TRANSFER_COINS(
    $fromAddress: String!
    $sequenceNumber: Int!
    $toAddress: String!
    $amount: Int!
    $secretKey: String!
  ) {
    transferMoney(
      fromAddress: $fromAddress
      sequenceNumber: $sequenceNumber
      toAddress: $toAddress
      amount: $amount
      secretKey: $secretKey
    ) {
      version
      signed_transaction {
        signed_txn {
          sequence_number
          from_account
          to_account
          amount
          expiration_time
        }
      }
      events {
        events {
          event_data {
            event_type
          }
        }
      }
    }
  }
`