import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import QRCode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const MainDiv = styled.div`
  width: 50%;
  height: 100%;
  background: ${props => props.theme.white};
  margin: 0 auto;
  color: ${props => props.theme.black};
  border: 1px solid ${props => props.theme.grey};
  border-radius: ${props => props.theme.shape.borderRadius * 2}px;
  padding: 0;
  padding-bottom: 2rem;

  @media ${props => props.theme.lg} {
    width: 70%;
    margin-top: 2rem;
  }

  @media ${props => props.theme.md} {
    width: 70%;
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

  .header {
    width: 100%;
    margin: 2rem auto;
    text-align: center;

    @media ${props => props.theme.sm} {
      width: 80%;
    }

    .header-text {
      margin-top: 3rem;
      margin-bottom: 1rem;
      font-size: 2rem;
      font-weight: bold;
      color: ${props => props.theme.libraBlue};
      font-weight: ${props => props.theme.typography.fontWeightMedium};

      @media ${props => props.theme.md} {
        font-size: 2.5rem;
      }

      @media ${props => props.theme.sm} {
        font-size: 1.8rem;
        margin-top: 1rem;
      }
    }
  }

  .account {
    width: 100%;
    margin: 0 auto;
    text-align: center;

    @media ${props => props.theme.sm} {
      margin-bottom: 3rem;
      width: 80%;
    }

    .address {
      font-size: 1.1rem;
      color: ${props => props.theme.grey};
      margin: 2rem auto;

      word-wrap: break-word;
    }

    .copy {
      font-size: 2.2rem;
      color: ${props => props.theme.grey};
    }

    .qr-code {
      margin: 2rem auto;

      @media ${props => props.theme.sm} {
        width: 60%;
      }
    }
  }
`;

const ShareQR = () => {
  const { address } = useParams();
  const history = useHistory();
  const [copied, setCopied] = useState(false);

  const notyf = new Notyf();

  return (
    <MainDiv>
      <div className="header">
        <div className="header-text">Account Address</div>
      </div>

      <div className="account">
        <div className="address">{address}</div>
        <div className="copy">
          <CopyToClipboard
            text={address}
            onCopy={() => {
              setCopied(true);
              notyf.success("copied");
              // notify();
            }}
          >
            <FontAwesomeIcon icon="copy" style={{ cursor: "pointer" }} />
          </CopyToClipboard>
        </div>
        <div className="qr-code">
          <QRCode value={address} size={150} />
        </div>
      </div>
    </MainDiv>
  );
};

export default ShareQR;
