import React from 'react'

import {
  ActivityProvider,
  RouterProvider,
  ManualTransferProvider,
  QrCodeProvider,
  StateProvider
} from './index'

const ProviderComposer = ({ contexts, children }) => {
  return contexts.reduceRight(
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids
      }),
    children
  )
}

const ContextProvider = ({ children }) => (
  <ProviderComposer
    contexts={[
      <ManualTransferProvider />,
      <ActivityProvider />,
      <QrCodeProvider />,
      <StateProvider />,
      <RouterProvider />
    ]}
  >
    {children}
  </ProviderComposer>
)

export default ContextProvider
