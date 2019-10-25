import gql from 'graphql-tag'

const typeDefs = gql`
  extend type Query {
    user: User
    events: [EventDetail]!
  }

  extend type User {
    balance: Int
    sequenceNumber: Int
  }

  extend type EventDetail {
    sequenceNumber: Int
    amount: Int
    toAccount: String
    fromAccount: String
    date: String
    event_type: String
  }
`

export default typeDefs
