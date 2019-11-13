import React, { useContext } from "react";
import { Button } from "@material-ui/core";
import QrReader from "react-qr-reader";
import OutSideClick from "react-outside-click-handler";
import styled from "styled-components";

import { ActivityContext, QrCodeContext } from "../../hooks";

const Div = styled.div`
  width: 50%;
  border: 1px solid ${props => props.theme.grey};
  background: ${props => props.theme.white};
  border-radius: ${props => props.theme.shape.borderRadius * 2}px;
  height: 100%;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 2rem auto;

  @media ${props => props.theme.lg} {
    width: 40%;
    top: 25%;
    height: 35%;
  }

  @media ${props => props.theme.md} {
    width: 40%;
    top: 35%;
    height: 40%;
  }

  @media ${props => props.theme.sm} {
    width: 100%;
    top: 50%;
    height: 80%;
  }

  .close {
    height: 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 1rem;

    .close-left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3rem;
      height: 3rem;
      margin-top: 0.5rem;
      margin-right: 1rem;
      font-size: 3rem;
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

    @media ${props => props.theme.sm} {
      margin-bottom: 0;
    }
  }

  .qr-code-reader {
    height: 75%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;

    .qr-reader {
      width: 70%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      @media ${props => props.theme.lg} {
        width: 80%;
        height: 80%;
        margin: 0;
      }

      @media ${props => props.theme.md} {
        width: 100%;
        height: 90%;
        margin: 0;
      }

      @media ${props => props.theme.sm} {
        width: 100%;
        margin: 0;
      }
    }
  }

  .to-manual {
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
  }
`;

const QR = () => {
  const { closeScanQR, manual } = useContext(ActivityContext);
  const { handleScan, handleError } = useContext(QrCodeContext);

  return (
    <OutSideClick onOutsideClick={closeScanQR}>
      <Div>
        <div className="close">
          <div className="close-left" onClick={closeScanQR}>
            &times;
          </div>
        </div>

        <div className="qr-code-reader">
          <QrReader
            delay={200}
            onError={handleError}
            onScan={handleScan}
            className="qr-reader"
          />
        </div>

        <div className="to-manual">
          <Button className="switch-mode" onClick={manual}>
            Switch to Manual
          </Button>
        </div>
      </Div>
    </OutSideClick>
  );
};

export default QR;
