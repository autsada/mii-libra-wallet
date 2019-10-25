import React, { createContext, useState } from 'react'

import { getLocalEvents } from '../helpers/getLocalStorageData'

export const EventsContext = createContext()

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState(null)

  const getEvents = () => {
    const evts = getLocalEvents()

    setEvents(evts)
  }

  return (
    <EventsContext.Provider value={{ events, getEvents }}>
      {children}
    </EventsContext.Provider>
  )
}
