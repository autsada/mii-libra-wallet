import React, { useContext } from 'react'
import styled from 'styled-components'

import { ActivityContext } from '../../hooks/activityContext'
import Backdrop from '../Backdrop'
import TransferMethodModal from './TransferMethodModal'
import ManualTransferModal from './ManualTransferModal'
import QrCodeModal from './QrCodeModal'

const Div = styled.div`
  margin: auto;
`

function Modal() {
  const { isSendCoins, isManual, isScanQR } = useContext(ActivityContext)
  return (
    <Div>
      <Backdrop />
      {isSendCoins && <TransferMethodModal />}
      {isManual && <ManualTransferModal />}
      {isScanQR && <QrCodeModal />}
    </Div>
  )
}

export default Modal
