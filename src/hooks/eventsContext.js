import React, { createContext, useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { getLocalEvents } from '../helpers/getLocalStorageData'
import { GET_EVENTS } from '../apolloClient/query'

export const EventsContext = createContext()

export const EventsProvider = ({ children }) => {
  const { data } = useQuery(GET_EVENTS)
  const [eventsList, setEventsList] = useState(getLocalEvents())
  const [displayedEvents, setDisplayedEvents] = useState(
    data.events.slice(0, 3)
  )
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    if (data.events.length > displayedEvents.length) {
      setHasMore(true)
    } else {
      setHasMore(false)
    }
  }, [displayedEvents])

  const getEvents = () => {
    const evts = getLocalEvents()

    setEventsList(evts)
  }

  const loadMore = () => {
    if (hasMore) {
      setTimeout(() => {
        setDisplayedEvents([
          ...displayedEvents,
          ...data.events.slice(
            displayedEvents.length,
            data.events.length - displayedEvents.length > 3
              ? displayedEvents.length + 3
              : data.events.length
          )
        ])
      }, 1000)
    }
  }

  const clearDisplayedEvents = () => {
    setDisplayedEvents(
      data && data.events && data.events.length > 3
        ? data.events.slice(0, 3)
        : data.events
    )
  }

  return (
    <EventsContext.Provider
      value={{
        displayedEvents,
        loadMore,
        hasMore,
        clearDisplayedEvents,
        eventsList,
        getEvents
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}
