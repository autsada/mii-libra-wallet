import React, { useContext } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSpring, animated } from "react-spring"

import { ActivityContext } from "../hooks"
import Head from "./Head"
import EventsList from "./EventsList"
import ReceivedCoinsMessage from "./ReceivedCoinsMessage"
import Account from "./Account"

const MainDiv = styled.div`
  width: 50%;
  height: auto;
  background: ${props => props.theme.white};
  margin: 0 auto;
  color: ${props => props.theme.black};
  border: 1px solid ${props => props.theme.grey};
  border-radius: ${props => props.theme.shape.borderRadius * 2}px;
  padding: 0;
  padding-bottom: 3rem;
  /* position: relative; */

  @media ${props => props.theme.lg} {
    width: 65%;
    height: auto;
    margin-top: 2rem;
  }

  @media ${props => props.theme.md} {
    width: 80%;
    height: auto;
    margin-top: 2rem;
  }

  @media ${props => props.theme.sm} {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-bottom: none;
    margin: 0;
  }

  .account {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 3rem;

    @media ${props => props.theme.sm} {
      margin-bottom: 3rem;
      width: 80%;
    }
  }

  .action-button {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 2rem;
    color: white;
    width: 80%;
    height: 5rem;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    background: ${props => props.theme.libraBlue};
    transition: background-color ${props => props.theme.transitionDuration}
      ease-in;

    &:hover {
      background: ${props => props.theme.darkBlue};
    }

    @media ${props => props.theme.sm} {
      height: 6rem;
      width: 80%;
    }

    .button-text {
      width: 85%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.6rem;
      color: white;
      margin-right: -20%;
      border-radius: 0 4px 4px 0;
      transition: background-color ${props => props.theme.transitionDuration}
        ease-in;

      @media ${props => props.theme.md} {
        /* font-size: 1.6rem; */
      }

      @media ${props => props.theme.sm} {
        /* font-size: 1.4rem; */
      }
    }

    .svg-inline--fa {
      font-size: 1.4rem;
    }
  }
`

// const Account = React.lazy(() => import('./Account'))

const Main = () => {
  const { startSendCoins, showEvents, toggleShowEvents } = useContext(
    ActivityContext
  )

  const fade = useSpring({ from: { opacity: 0 }, opacity: 1 })

  return (
    <MainDiv>
      <Head />

      <div className="account">
        <Account />
      </div>

      <div className="action-button" onClick={startSendCoins}>
        <div className="button-text">Transfer</div>
        <FontAwesomeIcon icon="paper-plane" />
      </div>

      <div className="action-button" onClick={toggleShowEvents}>
        <div className="button-text">Activities</div>

        {showEvents ? (
          <animated.div style={fade}>
            <FontAwesomeIcon icon="angle-down" />
          </animated.div>
        ) : (
          <animated.div style={fade}>
            <FontAwesomeIcon icon="angle-up" />
          </animated.div>
        )}
      </div>

      {/* {showEvents && <EventsList />} */}
      <EventsList />

      <ReceivedCoinsMessage />
    </MainDiv>
  )
}

export default Main
