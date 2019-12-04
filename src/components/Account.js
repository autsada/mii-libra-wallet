import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import QRCode from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon
} from "react-share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

import { QueryContext, useCreateAccount, useQueryState } from "../hooks";
import Balance from "./Balance";
import Loader from "./Loader";

const AccountDiv = styled.div`
  margin: 0 auto;

  .address {
    font-size: 1.1rem;
    color: ${props => props.theme.grey};
    p {
      word-wrap: break-word;
    }

    @media ${props => props.theme.sm} {
      font-size: 1.3rem;
    }
  }

  .share-button {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;

    .button {
      cursor: pointer;
      margin: auto 0.5rem;

      .btn {
        margin: 0;
      }
    }

    .copy {
      font-size: 2.2rem;
      color: ${props => props.theme.grey};
      margin-left: 0.5rem;
      margin-top: 0.2rem;
    }
  }

  .balance {
    font-size: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.libraBlue};
    margin-bottom: 2rem;
  }

  .qr-code {
    margin: 2rem auto;

    @media ${props => props.theme.sm} {
      width: 60%;
    }
  }
`;

const Account = () => {
  const { accountState } = useContext(QueryContext);
  const { setCheckState } = useQueryState(accountState);
  const [copied, setCopied] = useState(false);
  const {
    createAccount,
    createAccountLoading,
    createAccountError
  } = useCreateAccount();

  // Share url for address
  const url = `${window.location.href}account/${accountState &&
    accountState.address}`;

  const notyf = new Notyf();

  // const notify = () =>
  //   toast.success("copied", { position: toast.POSITION.BOTTOM_CENTER });

  useEffect(() => {
    if (
      !accountState ||
      (accountState &&
        accountState.address &&
        accountState.secretKey &&
        !accountState.mnemonic)
    ) {
      const createUser = async () => {
        try {
          const res = await createAccount();

          if (res) {
            if (
              res.data.createAccount.address &&
              res.data.createAccount.mnemonic
            ) {
              setCheckState(true);
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
      createUser();
    }
  }, []);

  return (
    <AccountDiv>
      {(!accountState ||
        (accountState && !accountState.address) ||
        createAccountLoading) && <Loader />}

      {createAccountError && (
        <p>Ooobs, something went wrong in creating account.</p>
      )}

      {accountState &&
        accountState.address &&
        !createAccountLoading &&
        !createAccountError && (
          <div className="address">
            <p>{accountState && accountState.address}</p>
          </div>
        )}

      <div className="share-button">
        <FacebookShareButton url={url} quote="facebook" className="button">
          <FacebookIcon size={30} round className="btn" />
        </FacebookShareButton>

        <TwitterShareButton url={url} title="twitter" className="button">
          <TwitterIcon size={30} round className="btn" />
        </TwitterShareButton>

        <WhatsappShareButton
          url={url}
          title="whatsapp"
          // separator=":: "
          className="button"
        >
          <WhatsappIcon size={30} round className="btn" />
        </WhatsappShareButton>

        <LineShareButton url={url} title="line" className="button">
          <LineIcon size={30} round className="btn" />
        </LineShareButton>

        <EmailShareButton
          url={url}
          subject="email"
          // body="body"
          className="button"
        >
          <EmailIcon size={30} round className="btn" />
        </EmailShareButton>

        <div className="copy">
          <CopyToClipboard
            text={accountState && accountState.address}
            onCopy={() => {
              setCopied(true);
              notyf.success("copied");
              // notify();
            }}
          >
            <FontAwesomeIcon icon="copy" style={{ cursor: "pointer" }} />
          </CopyToClipboard>
        </div>
      </div>

      {accountState && accountState.address && <Balance />}

      {accountState &&
        accountState.address &&
        !createAccountLoading &&
        !createAccountError && (
          <div className="qr-code">
            <QRCode value={accountState && accountState.address} size={150} />
          </div>
        )}

      {/* <ToastContainer autoClose={1000} /> */}
    </AccountDiv>
  );
};

export default Account;
