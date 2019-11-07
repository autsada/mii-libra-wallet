import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import typeDefs from './typeDefs'
import resolvers from './resolvers'

const cache = new InMemoryCache({ addTypename: false })

// Create an http link:
const httpLink = new HttpLink({
  uri: 'https://libra-graphql.herokuapp.com/'
  // uri: 'http://localhost:8000'
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: 'wss://libra-graphql.herokuapp.com/',
  options: {
    reconnect: true
  }
})

wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
  wsLink.subscriptionClient.maxConnectTimeGenerator.max

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers
})

// Initialize local state
client.writeData({
  data: {
    // user: JSON.parse(localStorage.getItem('User')) || {},
    // events: JSON.parse(localStorage.getItem('Events')) || []
  }
})

export default client
