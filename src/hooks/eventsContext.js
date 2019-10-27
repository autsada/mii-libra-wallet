import React, { createContext, useState } from 'react'

import { getLocalEvents } from '../helpers/getLocalStorageData'

export const EventsContext = createContext()

export const EventsProvider = ({ children }) => {
  const [eventsList, setEvents] = useState(getLocalEvents() || [])

  const getEvents = () => {
    const evts = getLocalEvents()

    setEvents(evts)
  }

  return (
    <EventsContext.Provider value={{ eventsList, getEvents }}>
      {children}
    </EventsContext.Provider>
  )
}
