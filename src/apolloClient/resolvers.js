import { GET_CURRENT_USER, GET_EVENTS } from './query'

const resolvers = {
  User: {
    balance: (_user, _, { cache }) => {
      const { user } = cache.readQuery({ query: GET_CURRENT_USER })
      return user.balance || undefined
    },
    sequenceNumber: (_user, _, { cache }) => {
      const { user } = cache.readQuery({ query: GET_CURRENT_USER })
      return user.sequenceNumber || undefined
    }
  },
  EventData: {
    sequenceNumber: (eventDetail, _, { cache }) => {
      const { events } = cache.readQuery({ query: GET_EVENTS })
      const event = events.find(
        evt => evt.transaction_version === eventDetail.transaction_version
      )
      return event.sequenceNumber
    },
    amount: (eventDetail, _, { cache }) => {
      const { events } = cache.readQuery({ query: GET_EVENTS })
      const event = events.find(
        evt => evt.transaction_version === eventDetail.transaction_version
      )
      return event.amount
    },
    toAccount: (eventDetail, _, { cache }) => {
      const { events } = cache.readQuery({ query: GET_EVENTS })
      const event = events.find(
        evt => evt.transaction_version === eventDetail.transaction_version
      )
      return event.toAccount
    },
    fromAccount: (eventDetail, _, { cache }) => {
      const { events } = cache.readQuery({ query: GET_EVENTS })
      const event = events.find(
        evt => evt.transaction_version === eventDetail.transaction_version
      )
      return event.fromAccount
    },
    date: (eventDetail, _, { cache }) => {
      const { events } = cache.readQuery({ query: GET_EVENTS })
      const event = events.find(
        evt => evt.transaction_version === eventDetail.transaction_version
      )
      return event.date
    }
  }
}

export default resolvers
