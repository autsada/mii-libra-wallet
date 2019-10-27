import React, { useContext } from 'react'
import { format } from 'date-fns'
import { Waypoint } from 'react-waypoint'
import NumberFormat from 'react-number-format'
// import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent } from '@material-ui/core'
import styled from 'styled-components'

import { EventsContext } from '../hooks/eventsContext'

// const useStyles = makeStyles({
//   card: {
//     minWidth: 275
//   },
//   bullet: {
//     display: 'inline-block',
//     margin: '0 2px',
//     transform: 'scale(0.8)'
//   },
//   title: {
//     fontSize: 14
//   },
//   pos: {
//     marginBottom: 12
//   }
// })

const Div = styled.div`
  width: 80%;
  height: auto;
  background: ${props => props.theme.white};
  margin: 0 auto;
  color: ${props => props.theme.black};
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
    width: 98%;
    margin-top: 0;
  }

  .event {
    height: 10%;
    margin: 0.5rem auto;
  }
`

const CardDetail = styled(CardContent)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  .event-details {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 1rem;

    .event-item {
      display: flex;
      flex-direction: column;
      justify-content: start;
      /* align-items: center; */
      font-size: 0.9rem;
      margin-right: 2.2rem;
    }
  }

  .event-address {
    font-size: 0.8rem;
  }
`

const EventsList = () => {
  // const classes = useStyles()
  const { eventsList } = useContext(EventsContext)

  return (
    <Div>
      {!eventsList && <p>No activity</p>}
      {eventsList &&
        eventsList.map((event, i) => (
          <Waypoint key={event.date} onEnter={() => {}}>
            <Card className='event'>
              <CardDetail>
                <div className='event-details'>
                  <div className='event-item'>
                    <span style={{ fontWeight: 'bold' }}>Date:</span>{' '}
                    <span>
                      {format(
                        new Date(
                          event.event_type === 'mint'
                            ? +event.date
                            : +event.date * 1000
                        ),
                        'dd-MMM-yyyy: hh:mm a'
                      )}
                    </span>
                  </div>
                  <div className='event-item'>
                    <span style={{ fontWeight: 'bold' }}>TxnVersion:</span>{' '}
                    <span>{event.transaction_version}</span>
                  </div>
                  <div className='event-item'>
                    <span
                      style={{
                        fontWeight: 'bold'
                      }}
                    >
                      Type:
                    </span>{' '}
                    <span
                      style={{
                        fontWeight: 'bolder',
                        color: `${
                          event.event_type === 'received'
                            ? 'green'
                            : event.event_type === 'sent'
                            ? 'red'
                            : 'blue'
                        }`
                      }}
                    >
                      {event.event_type.toUpperCase()}
                    </span>
                  </div>
                  <div className='event-item'>
                    <span style={{ fontWeight: 'bolder', fontSize: '1rem' }}>
                      Amount:
                    </span>{' '}
                    <NumberFormat
                      value={event.amount / 1000000}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'Lib: '}
                      renderText={value => <span>{value}</span>}
                    />
                  </div>
                </div>
                <div className='event-address'>
                  <span style={{ fontWeight: 'bold' }}>
                    {event.event_type === 'sent' ? 'To' : 'From'}:
                  </span>{' '}
                  {event.event_type === 'sent'
                    ? event.toAccount
                    : event.fromAccount}
                </div>
              </CardDetail>
            </Card>
          </Waypoint>
        ))}
    </Div>
  )
}

export default EventsList
