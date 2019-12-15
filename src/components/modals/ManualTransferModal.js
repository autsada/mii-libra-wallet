import React, { useContext } from "react";
import styled from "styled-components";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import OutSideClick from "react-outside-click-handler";

import {
  ActivityContext,
  QueryContext,
  ManualTransferContext,
  QrCodeContext,
  useTransferCoins
} from "../../hooks";
import Loader from "../Loader";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: "100px"
  },
  cssOutlinedInput: {
    "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
      borderColor: `${theme.teal}`,
      borderWidth: "0.6px" //default
    },
    "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
      borderWidth: "1px",
      borderColor: `${theme.teal}` //hovered
    },
    "&$cssFocused $notchedOutline": {
      borderWidth: "1px",
      borderColor: `${theme.teal}` //focused
    }
  },
  notchedOutline: {},
  cssFocused: {},
  error: {},
  disabled: {}
}));

const Div = styled.div`
  width: 50%;
  border: 1px solid ${props => props.theme.grey};
  background: ${props => props.theme.white};
  border-radius: ${props => props.theme.shape.borderRadius * 2}px;
  height: 65%;
  position: absolute;
  margin: 4rem auto;
  top: 50%;
  left: 50%;

  /* display: flex;
  justify-content: center;
  align-items: center; */
  transform: translate(-50%, -50%);

  @media ${props => props.theme.lg} {
    top: 30%;
    width: 50%;
    height: 25%;
  }

  @media ${props => props.theme.md} {
    top: 30%;
    width: 50%;
    height: 35%;
  }

  @media ${props => props.theme.sm} {
    top: 40%;
    width: 100%;
    height: 100%;
  }

  .transfer-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-top: 8rem;
    color: red;

    @media ${props => props.theme.sm} {
      margin-top: 16rem;
    }
  }

  .close {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 20%;

    @media ${props => props.theme.sm} {
      justify-content: center;
    }

    .close-left {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3rem;
      height: 3rem;
      margin-top: 0;
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
        right: 0.5rem;
      }
    }
  }

  .transfering {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    margin-top: 8rem;

    @media ${props => props.theme.sm} {
      margin-top: 16rem;
    }

    .transfer-message {
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => props.theme.libraBlue};
      font-size: 1.5rem;
      margin-top: 3rem;
    }
  }

  .form {
    height: 20%;

    form {
      width: 80%;
      margin: 1rem auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0;

      @media ${props => props.theme.sm} {
        margin: 5% auto;
        width: 80%;
      }

      .input-field {
        margin-bottom: 0.5rem;
      }

      .MuiOutlinedInput-root {
        @media ${props => props.theme.sm} {
          height: 4rem;
          font-size: 1.4rem;
        }
      }

      .MuiOutlinedInput-root .border-error {
        border-color: ${props => props.theme.red};
      }

      .MuiInputLabel-outlined {
        @media ${props => props.theme.sm} {
          font-size: 1.8rem;
        }
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        transition: background-color 5000s ease-in-out 0s;
        -webkit-text-fill-color: ${props => props.theme.black} !important;
      }

      .submit-button-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        margin-top: 2%;
        padding: 0;
        height: 6rem;
        border-radius: ${props => props.theme.shape.borderRadius * 2}px;

        @media ${props => props.theme.sm} {
          /* margin-top: 3rem; */
          height: 4rem;
        }

        .to-qr {
          background: ${props => props.theme.black};

          &:hover {
            background: ${props => props.theme.grey};
          }
        }

        .cancel {
          background: ${props => props.theme.red};

          &:hover {
            background: ${props => props.theme.darkRed};
          }
        }
      }

      .error {
        margin-bottom: 2rem;

        .error-text {
          color: red;
          margin: 0 1rem;
          font-size: 1.2rem;
        }
      }
    }
  }
`;

const ManualTransfer = () => {
  const classes = useStyles();
  const { cancelManual, scanQR } = useContext(ActivityContext);
  const { accountState } = useContext(QueryContext);
  const { qrValue } = useContext(QrCodeContext);
  const {
    transferArgs: { receiver, amount },
    handleChange,
    handleBlur,
    receiverError,
    amountError
  } = useContext(ManualTransferContext);

  const { transferCoins, loading, error } = useTransferCoins({
    accountState,
    receiver: receiver || qrValue,
    transferAmount: amount
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await transferCoins();
    } catch (err) {
      // cancelManual();
    }
  };

  return (
    <>
      {accountState && (
        <OutSideClick onOutsideClick={cancelManual}>
          <Div>
            {loading && (
              <div className="transfering">
                <Loader />
                <div className="transfer-message">
                  Transfering coins, please wait.
                </div>
              </div>
            )}

            {!loading && (
              <div className="close">
                <div className="close-left" onClick={cancelManual}>
                  &times;
                </div>
              </div>
            )}

            {error && (
              <div className="transfer-error">
                <div>Ooobs..., something went wrong. Please try again.</div>
              </div>
            )}

            {!loading && !error && (
              <div className="form">
                <form onSubmit={handleSubmit}>
                  <div>
                    <TextField
                      type="text"
                      id="receiver"
                      name="receiver"
                      label="Receiver Address"
                      placeholder="Receiver Address"
                      className="input-field"
                      value={receiver || qrValue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required={true}
                      error={receiverError}
                      fullWidth
                      variant="outlined"
                      inputProps={{ maxLength: 64 }}
                      InputProps={{
                        classes: {
                          notchedOutline: classes.notchedOutline,
                          root: classes.cssOutlinedInput,
                          focused: classes.cssFocused
                        }
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />

                    <>
                      {
                        <div className="error">
                          {!receiver && !qrValue ? (
                            <p className="error-text">
                              Receiver address is required
                            </p>
                          ) : (receiver && receiver.length < 64) ||
                            (qrValue && qrValue.length < 64) ? (
                            <p className="error-text">Address is too short</p>
                          ) : (receiver && receiver.length > 64) ||
                            (qrValue && qrValue.length > 64) ? (
                            <p className="error-text">Address is too long</p>
                          ) : receiver ===
                              (accountState && accountState.address) ||
                            qrValue ===
                              (accountState && accountState.address) ? (
                            <p className="error-text">
                              Invalid receiver address
                            </p>
                          ) : null}
                        </div>
                      }
                    </>

                    <TextField
                      type="number"
                      id="amount"
                      name="amount"
                      label="Transfer Amount"
                      placeholder="Amount you want to transfer"
                      className="input-field"
                      value={!amount ? "" : amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required={true}
                      error={amountError}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        classes: {
                          notchedOutline: classes.notchedOutline,
                          root: classes.cssOutlinedInput,
                          focused: classes.cssFocused
                        }
                      }}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>

                  <>
                    {
                      <div className="error">
                        {!amount ? (
                          <p className="error-text">Amount is required</p>
                        ) : null}
                      </div>
                    }
                  </>

                  <div className="submit-button-container">
                    <Button className="to-qr" onClick={scanQR}>
                      Switch to Scan QR
                    </Button>
                    <Button
                      type="submit"
                      style={{
                        color:
                          (((!receiver ||
                            (receiver && receiver.length !== 64)) &&
                            !qrValue) ||
                            (qrValue && qrValue.length !== 64) ||
                            receiver ===
                              (accountState && accountState.address) ||
                            qrValue ===
                              (accountState && accountState.address) ||
                            !amount ||
                            loading ||
                            error) &&
                          "grey",
                        cursor:
                          ((!receiver ||
                            (receiver && receiver.length !== 64)) &&
                            !qrValue) ||
                          (qrValue && qrValue.length !== 64) ||
                          receiver === (accountState && accountState.address) ||
                          qrValue === (accountState && accountState.address) ||
                          !amount ||
                          loading ||
                          error
                            ? "not-allowed"
                            : "pointer"
                      }}
                      disabled={
                        ((!receiver || (receiver && receiver.length !== 64)) &&
                          !qrValue) ||
                        (qrValue && qrValue.length !== 64) ||
                        receiver === (accountState && accountState.address) ||
                        qrValue === (accountState && accountState.address) ||
                        !amount ||
                        loading ||
                        error
                      }
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Div>
        </OutSideClick>
      )}
    </>
  );
};

export default ManualTransfer;
