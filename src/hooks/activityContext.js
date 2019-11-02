import React, { useState, createContext, useContext } from 'react'

import { ManualTransferContext } from './index'

export const ActivityContext = createContext()

export const ActivityProvider = ({ children }) => {
  const { clearTransferInputs } = useContext(ManualTransferContext)
  // const { getEvents, clearDisplayEvents } = useContext(EventsContext)
  const [isManual, setIsManual] = useState(false)
  const [isScanQR, setIsScanQR] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [isSendCoins, setIsSendCoins] = useState(false)
  const [showEvents, setShowEvents] = useState(false)

  const startSendCoins = () => {
    setOpenModal(true)
    setIsSendCoins(true)
  }

  const cancelSendCoins = () => {
    setOpenModal(false)
    setIsSendCoins(false)
  }

  const manual = () => {
    setIsSendCoins(false)
    setIsScanQR(false)
    setIsManual(true)
  }

  const cancelManual = () => {
    setOpenModal(false)
    setIsSendCoins(false)
    setIsManual(false)
    clearTransferInputs()
  }

  const scanQR = () => {
    setIsSendCoins(false)
    setIsManual(false)
    clearTransferInputs()
    setIsScanQR(true)
  }

  const finishReadQr = () => manual()

  const closeScanQR = () => {
    setOpenModal(false)
    setIsSendCoins(false)
    setIsScanQR(false)
  }

  const toggleShowEvents = () => {
    setShowEvents(!showEvents)

    // if (showEvents) {
    //   clearDisplayEvents()
    // } else {
    //   getEvents()
    // }
  }

  return (
    <ActivityContext.Provider
      value={{
        openModal,
        isSendCoins,
        startSendCoins,
        cancelSendCoins,
        isManual,
        manual,
        cancelManual,
        isScanQR,
        scanQR,
        finishReadQr,
        closeScanQR,
        showEvents,
        toggleShowEvents
      }}
    >
      {children}
    </ActivityContext.Provider>
  )
}
