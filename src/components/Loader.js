import React from 'react'
import styled from 'styled-components'

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem auto;

  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid ${props => props.theme.libraBlue};
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 28px;
      left: 28px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: -1px;
      left: -1px;
      width: 58px;
      height: 58px;
      opacity: 0;
    }
  }
`

const Loader = () => (
  <Div>
    <div className='lds-ripple'>
      <div></div>
      <div></div>
    </div>
  </Div>
)

export default Loader
