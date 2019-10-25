import React from 'react'
import styled from 'styled-components'

const BackdropStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.65);

  @media ${props => props.theme.lg} {
    height: 100vh;
    width: 100%;
  }

  @media ${props => props.theme.md} {
    height: 100vh;
    width: 100%;
  }

  @media ${props => props.theme.sm} {
    height: 100vh;
    width: 100%;
  }
`

const Backdrop = () => <BackdropStyle />

export default Backdrop
