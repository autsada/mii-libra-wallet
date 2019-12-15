import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import OutSideClick from "react-outside-click-handler";

import { ActivityContext } from "../../hooks";

const Div = styled.div`
  width: 30%;
  border: 1px solid ${props => props.theme.grey};
  background: ${props => props.theme.white};
  border-radius: ${props => props.theme.shape.borderRadius * 2}px;
  height: 15rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  @media ${props => props.theme.lg} {
    width: 40%;
    height: 15%;
    top: 32%;
  }

  @media ${props => props.theme.md} {
    width: 40%;
    top: 40%;
  }

  @media ${props => props.theme.sm} {
    width: 75%;
    height: 25%;
    top: 50%;
  }

  .close {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 15%;
    width: 100%;

    .close-left {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.7rem;
      margin-right: 0.2rem;
      width: 3rem;
      height: 3rem;
      font-size: 2rem;
      color: ${props => props.theme.grey};
      cursor: pointer;
      border-radius: 50px;
      transition: background-color ${props => props.theme.transitionDuration}
        ease-in;

      &:hover {
        color: ${props => props.theme.black};
        background: ${props => props.theme.lightgrey};
      }

      @media ${props => props.theme.sm} {
        font-size: 2rem;
        right: 0.5rem;
      }
    }
  }

  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40%;

    p {
      font-weight: bold;

      @media ${props => props.theme.sm} {
        /* font-weight: lighter; */
        font-size: 1.5rem;
      }
    }
  }
  .btn-method {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 45%;
  }
`;

const TransferMethodModal = () => {
  const { manual, scanQR, cancelSendCoins } = useContext(ActivityContext);

  return (
    <OutSideClick onOutsideClick={cancelSendCoins}>
      <Div>
        <div className="close">
          <div className="close-left" onClick={cancelSendCoins}>
            &times;
          </div>
        </div>
        <div className="head">
          <p>Choose Transfer Method</p>
        </div>
        <div className="btn-method">
          <Button onClick={manual}>Manual</Button>
          <Button onClick={scanQR}>Scan QR</Button>
        </div>
      </Div>
    </OutSideClick>
  );
};

export default TransferMethodModal;
