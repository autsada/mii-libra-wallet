import React from "react"
import { StylesProvider } from "@material-ui/styles"
import { MuiThemeProvider } from "@material-ui/core/styles"
import { ApolloProvider } from "@apollo/react-hooks"
import { Route } from "react-router-dom"

import ContextProvider from "./hooks/store/state"
import "./fontawesome/fontawesome"
import client from "./apolloClient/client"
import Page from "./components/Page"
import { muiTheme } from "./cssTheme"
import MainPage from "./pages/MainPage"
import ShareQrPage from "./pages/ShareQrPage"

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ContextProvider>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={muiTheme}>
            <Page>
              <Route exact path="/">
                <MainPage />
              </Route>
              <Route path="/account/:address">
                <ShareQrPage />
              </Route>
            </Page>
          </MuiThemeProvider>
        </StylesProvider>
      </ContextProvider>
    </ApolloProvider>
  )
}

export default App
