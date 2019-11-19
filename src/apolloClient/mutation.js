import gql from "graphql-tag"

export const CREATE_ACCOUNT = gql`
  mutation CREATE_ACCOUNT {
    createAccount {
      address
      # secretKey
      mnemonic
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

// export const TRANSFER_COINS = gql`
//   mutation TRANSFER_COINS(
//     $fromAddress: String!
//     $sequenceNumber: Int!
//     $toAddress: String!
//     $amount: Int!
//     $secretKey: String!
//   ) {
//     transferMoney(
//       fromAddress: $fromAddress
//       sequenceNumber: $sequenceNumber
//       toAddress: $toAddress
//       amount: $amount
//       secretKey: $secretKey
//     ) {
//       version
//       transaction {
//         transaction {
//           sequence_number
//           from_account
//           to_account
//           amount
//           expiration_time
//         }
//       }
//       events {
//         events {
//           event_data {
//             event_type
//           }
//         }
//       }
//     }
//   }
// `

export const TRANSFER_COINS = gql`
  mutation TRANSFER_COINS(
    $fromAddress: String!
    $sequenceNumber: Int!
    $toAddress: String!
    $amount: Int!
    $mnemonic: String!
  ) {
    transferCoins(
      fromAddress: $fromAddress
      sequenceNumber: $sequenceNumber
      toAddress: $toAddress
      amount: $amount
      mnemonic: $mnemonic
    ) {
      version
      transaction {
        transaction {
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
