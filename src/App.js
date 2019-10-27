import React from 'react'
import { StylesProvider } from '@material-ui/styles'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from '@apollo/react-hooks'

import client from './apolloClient/client'
import Page from './components/Page'
import { muiTheme } from './cssTheme'
import MainPage from './pages/MainPage'
import ContextProvider from './hooks/state'
import './fontawesome/fontawesome'

// const accountState = JSON.parse(localStorage.getItem('User'))

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ContextProvider>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={muiTheme}>
            <Page>
              {/* <MainPage accountState={accountState} /> */}
              <MainPage />
            </Page>
          </MuiThemeProvider>
        </StylesProvider>
      </ContextProvider>
    </ApolloProvider>
  )
}

export default App
