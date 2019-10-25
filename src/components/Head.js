import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  width: 100%;
  margin: 2rem auto;
  text-align: center;
  margin-bottom: 2rem;

  @media ${props => props.theme.sm} {
    margin-bottom: 3rem;
    width: 80%;
  }

  .header-text {
    margin-top: 3rem;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    font-weight: bold;
    color: ${props => props.theme.libraBlue};
    font-weight: ${props => props.theme.typography.fontWeightMedium};

    @media ${props => props.theme.md} {
      font-size: 3rem;
    }

    @media ${props => props.theme.sm} {
      font-size: 2.2rem;
      margin-top: 1rem;
    }
  }
`

function Head() {
  return (
    <Div>
      <h2 className='header-text'>My Wallet</h2>
    </Div>
  )
}

export default Head
