import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { QUERY_RECEIVED_EVENTS, QUERY_SENT_EVENTS } from '../apolloClient/query'

export const useQueryEvents = address => {
  const [events, setEvents] = useState([])
  const [queryEventsLoading, setQueryEventsLoading] = useState(false)
  const [isNoEvents, setIsNoEvents] = useState(false)

  const queryReceived = useQuery(QUERY_RECEIVED_EVENTS, {
    variables: { address },
    pollInterval: 10000
  })

  const querySent = useQuery(QUERY_SENT_EVENTS, {
    variables: { address },
    pollInterval: 10000
  })

  useEffect(() => {
    if (querySent && querySent.data && queryReceived && queryReceived.data) {
      const { querySentEvents } = querySent.data
      const { queryReceivedEvents } = queryReceived.data
      const allEvents = [...querySentEvents, ...queryReceivedEvents].sort(
        (e1, e2) => e2.transaction_version - e1.transaction_version
      )

      setEvents(allEvents)

      if (allEvents.length === 0) {
        setIsNoEvents(true)
      }
    }

    if (
      (querySent && querySent.loading) ||
      (queryReceived && queryReceived.loading)
    ) {
      setQueryEventsLoading(true)
    } else {
      setQueryEventsLoading(false)
    }
  }, [querySent, queryReceived])

  return { events, queryEventsLoading, isNoEvents }
}
