import gql from 'graphql-tag'

export const GET_CURRENT_USER = gql`
  query GET_CURRENT_USER {
    user @client {
      address
      secretKey
      sequenceNumber @client
      balance @client
    }
  }
`
export const GET_EVENTS = gql`
  query GET_EVENTS {
    events @client {
      transaction_version
      sequenceNumber @client
      amount @client
      toAccount @client
      fromAccount @client
      date @client
      event_type @client
    }
  }
`

export const QUERY_BY_ADDRESS = gql`
  query QUERY_BY_ADDRESS($address: String!) {
    queryByAddress(address: $address) {
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

export const QUERY_BY_SEQUENCE_NUMBER = gql`
  query QUERY_BY_SEQUENCE_NUMBER($address: String!, $sequenceNumber: Int!) {
    queryBySequenceNumber(address: $address, sequenceNumber: $sequenceNumber) {
      version
      signed_transaction {
        signed_txn {
          from_account
          to_account
          amount
          expiration_time
        }
      }
    }
  }
`

export const QUERY_RECEIVED_EVENTS = gql`
  query QUERY_RECEIVED_EVENTS($address: String!) {
    queryReceivedEvents(address: $address) {
      transaction_version
      event {
        sequence_number
        event_data {
          amount
          address
          event_type
        }
      }
    }
  }
`
