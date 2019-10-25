import React, { createContext, useState, useContext } from 'react'

import { ActivityContext } from './activityContext'

export const QrCodeContext = createContext()

export const QrCodeProvider = ({ children }) => {
  const { finishReadQr } = useContext(ActivityContext)
  const [qrValue, setQrValue] = useState('')
  const [qrError, setQrError] = useState(null)

  const handleScan = data => {
    if (data) {
      setQrValue(data)
      finishReadQr()
    }
  }

  const handleError = error => setQrError(error)

  return (
    <QrCodeContext.Provider
      value={{ qrValue, handleScan, qrError, handleError }}
    >
      {children}
    </QrCodeContext.Provider>
  )
}
