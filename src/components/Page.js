import React from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'

import NavBar from './NavBar'
import { muiTheme } from '../cssTheme'

const GlobalStyle = createGlobalStyle`
   html {
      box-sizing: border-box;
      font-size: 10px;
   }
   *, *:before, *:after {
      box-sizing: inherit;
   }
   body {
      padding: 0;
      margin: 0;
      font-size: 1.6rem;
      font-family: ${props => props.theme.typography.fontFamily};
      font-weight: 400;

   }
`

const StyledPage = styled.div`
  background: rgba(66, 49, 140, 0.35);
  color: ${props => props.theme.black};

  @media ${props => props.theme.lg} {
    height: 100vh;
    width: 100%;
  }

  @media ${props => props.theme.md} {
    height: 100vh;
    width: 100%;
  }

  @media ${props => props.theme.sm} {
    width: 100%;
  }
`

const InnerPage = styled.div`
  max-width: 80%;
  height: 80%;
  margin: 0 auto;
  padding: 2rem;

  @media ${props => props.theme.sm} {
    max-width: 100%;
    padding: 0;
  }
`

const Page = ({ children }) => (
  <ThemeProvider theme={muiTheme}>
    <>
      <GlobalStyle />
      <StyledPage>
        <NavBar />
        <InnerPage>{children}</InnerPage>
      </StyledPage>
    </>
  </ThemeProvider>
)

export default Page
