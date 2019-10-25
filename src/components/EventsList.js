import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'

import { EventsContext } from '../hooks/eventsContext'

const Div = styled.div`
  width: 80%;
  height: auto;
  background: ${props => props.theme.white};
  margin: 0 auto;
  color: ${props => props.theme.black};
  font-size: 0.8rem;
  /* border: 0.5px solid ${props => props.theme.grey}; */
  /* border-radius: ${props => props.theme.shape.borderRadius * 2}px; */
  padding: 0;

  @media ${props => props.theme.lg} {
    width: 70%;
    margin-top: 2rem;
  }

  @media ${props => props.theme.md} {
    width: 70%;
    margin-top: 2rem;
  }

  @media ${props => props.theme.sm} {
    width: 100%;
    margin-top: 0;
  }

  .event {
    display: grid;
          grid-template-columns: 1fr;
      border-top: 0.5px solid ${props => props.theme.grey};
      border-bottom: 0.5px solid ${props => props.theme.grey};
  }
`

const EventsList = () => {
  const { events, getEvents } = useContext(EventsContext)

  useEffect(() => {
    getEvents()
  }, [getEvents])

  return (
    <Div>
      {!events && <p>No activity</p>}
      {events &&
        events.map(event => (
          <div key={event.date} className='event'>
            <div>
              <span style={{ fontWeight: 'bold' }}>Date:</span> {event.date}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>TxnVersion:</span>{' '}
              {event.transaction_version}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>Type:</span>{' '}
              {event.event_type.toUpperCase()}
            </div>
            <div>
              <span style={{ fontWeight: 'bold' }}>
                {event.event_type === 'sent' ? 'To' : 'From'}:
              </span>{' '}
              {event.event_type === 'sent'
                ? event.toAccount
                : event.fromAccount}
            </div>
            <div>
              <span style={{ fontWeight: 'bolder', fontSize: '1rem' }}>
                Amount:
              </span>{' '}
              {event.amount / 1000000}
            </div>
          </div>
        ))}
    </Div>
  )
}

export default EventsList
