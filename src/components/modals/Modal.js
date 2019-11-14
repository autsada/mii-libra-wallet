import React, { useContext } from "react";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";

import { ActivityContext } from "../../hooks/activityContext";
import Backdrop from "../Backdrop";
import TransferMethodModal from "./TransferMethodModal";
import ManualTransferModal from "./ManualTransferModal";
import QrCodeModal from "./QrCodeModal";

const Div = styled.div`
  margin: auto;
`;

function Modal() {
  const { isSendCoins, isManual, isScanQR } = useContext(ActivityContext);

  const sendCoinsTransitions = useTransition(isSendCoins, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const manualTransitions = useTransition(isManual, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  const qrTransitions = useTransition(isScanQR, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <Div>
      <Backdrop />

      {sendCoinsTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <TransferMethodModal />
            </animated.div>
          )
      )}

      {manualTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <ManualTransferModal />
            </animated.div>
          )
      )}

      {qrTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <QrCodeModal />
            </animated.div>
          )
      )}
    </Div>
  );
}

export default Modal;
