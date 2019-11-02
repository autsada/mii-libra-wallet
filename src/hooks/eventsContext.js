import React, { createContext, useState } from 'react'

import { getLocalEvents } from '../helpers/getLocalStorageData'

export const EventsContext = createContext()

export const EventsProvider = ({ children }) => {
  const [eventsList, setEventsList] = useState(getLocalEvents() || [])
  // const [displayEvents, setDisplayEvents] = useState(null)

  // useEffect(() => {
  //   setDisplayEvents(
  //     (eventsList && eventsList.length > 5
  //       ? eventsList.slice(0, 5)
  //       : eventsList) || []
  //   )
  // }, [])

  const getEvents = () => {
    const evts = getLocalEvents()

    setEventsList(evts)
  }

  // const getDisplayEvents = evts => {
  //   setDisplayEvents(evts)
  // }

  // const clearDisplayEvents = () => {
  //   setDisplayEvents(
  //     (eventsList && eventsList.length > 5
  //       ? eventsList.slice(0, 5)
  //       : eventsList) || []
  //   )
  // }

  return (
    <EventsContext.Provider
      value={{
        eventsList,
        getEvents
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}
