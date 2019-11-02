import React from 'react'

import {
  ActivityProvider,
  RouterProvider,
  ManualTransferProvider,
  QrCodeProvider,
  EventsProvider,
  QueryProvider
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
      <EventsProvider />,
      <ActivityProvider />,
      <QrCodeProvider />,
      <QueryProvider />,
      <RouterProvider />
    ]}
  >
    {children}
  </ProviderComposer>
)

export default ContextProvider
