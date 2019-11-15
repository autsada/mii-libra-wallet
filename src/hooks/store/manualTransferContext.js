import React, { useState, createContext, useEffect } from 'react'

import usePrevious from '../usePrevious'

export const ManualTransferContext = createContext()

const transferArgsDefault = {
  receiver: '',
  amount: 0
}

export const ManualTransferProvider = ({ children }) => {
  const [transferArgs, setTransferArgs] = useState(transferArgsDefault)
  const [receiverError, setReceiverError] = useState(false)
  const [amountError, setAmountError] = useState(false)

  const prevArgs = usePrevious(transferArgs)

  const prevReceiver = prevArgs && prevArgs.receiver
  const currentReceiver = transferArgs && transferArgs.receiver
  const prevAmount = prevArgs && prevArgs.amount
  const currentAmount = transferArgs && transferArgs.amount

  useEffect(() => {
    // Validate receiver address
    if (
      prevArgs &&
      transferArgs &&
      prevReceiver !== currentReceiver &&
      currentReceiver.length !== 64
    ) {
      setReceiverError(true)
    }

    if (transferArgs && currentReceiver && currentReceiver.length === 64) {
      setReceiverError(false)
    }

    // Validate amount
    if (prevArgs && transferArgs && !currentAmount) {
      setAmountError(true)
    }

    if (transferArgs && currentAmount) {
      setAmountError(false)
    }
  }, [
    prevArgs,
    transferArgs,
    prevReceiver,
    currentReceiver,
    prevAmount,
    currentAmount
  ])

  const handleChange = e => {
    const { type, name, value } = e.target
    const val = type === 'number' ? parseFloat(+value) : value
    setTransferArgs({ ...transferArgs, [name]: val })
  }

  const handleBlur = () => {
    // Validate receiver address
    if (
      prevArgs &&
      transferArgs &&
      prevArgs.receiver !== transferArgs.receiver &&
      transferArgs.receiver.length !== 64
    ) {
      setReceiverError(true)
    }

    if (
      transferArgs &&
      transferArgs.receiver &&
      transferArgs.receiver.length === 64
    ) {
      setReceiverError(false)
    }

    // Validate amount
    if (prevArgs && transferArgs && !transferArgs.amount) {
      setAmountError(true)
    }

    if (transferArgs && transferArgs.amount) {
      setAmountError(false)
    }
  }

  const clearTransferInputs = () => {
    setTransferArgs(transferArgsDefault)
    setReceiverError(false)
    setAmountError(false)
  }

  return (
    <ManualTransferContext.Provider
      value={{
        transferArgs,
        handleChange,
        clearTransferInputs,
        handleBlur,
        receiverError,
        amountError
      }}
    >
      {children}
    </ManualTransferContext.Provider>
  )
}
