import React, { useContext } from 'react'
import { format } from 'date-fns'
// import { Waypoint } from 'react-waypoint'
import NumberFormat from 'react-number-format'
import { Card, CardContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'

import Loader from './Loader'
import { useQueryEvents, QueryContext } from './../hooks'

const useStyles = makeStyles({
  card: {
    maxHeight: 80,
    margin: 'auto',
    padding: 0
  },
  content: {
    maxWidth: '100%'
  }
})

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
    max-height: 100%;
    margin-top: 0;
  }

  .event {
    height: 8%;
    margin: 0.3rem auto;
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
  const classes = useStyles()
  const { accountState } = useContext(QueryContext)
  const { events, queryEventsLoading } = useQueryEvents(
    accountState && accountState.address
  )

  // function loadMoreEvents(index) {
  //   if (displayEvents) {
  //     const prevList = displayEvents
  //     const prevListLen = prevList.length
  //     const totalListLen = eventsList.length

  //     if (index === prevListLen - 1 && index < totalListLen - 1) {
  //       setTimeout(() => {
  //         setLoadMore(true)
  //         getDisplayEvents([
  //           ...prevList,
  //           ...eventsList.slice(index + 1, index + 2)
  //         ])
  //       }, 1000)
  //     }
  //   }
  // }

  // const onLeaveHandler = () => setLoadMore(false)

  return (
    <Div>
      {queryEventsLoading && <Loader />}

      {events && events.length === 0 && !queryEventsLoading && (
        <p>No activity</p>
      )}

      {events &&
        events.length > 0 &&
        events.map((event, i) => (
          // <Waypoint
          //   onEnter={() => loadMoreEvents(i)}
          //   onLeave={onLeaveHandler}
          // >
          <Card className={`event ${classes.card}`} key={event.expiration_time}>
            <CardDetail className={classes.content}>
              <div className='event-details'>
                <div className='event-item'>
                  <span style={{ fontWeight: 'bold' }}>Date:</span>{' '}
                  <span>
                    {format(
                      new Date(+event.expiration_time * 1000),
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
                        event.event.event_data.address.startsWith(
                          '000000000000000000000000000000000'
                        )
                          ? 'blue'
                          : event.event.event_data.event_type === 'received'
                          ? 'green'
                          : 'red'
                      }`
                    }}
                  >
                    {event.event.event_data.address.startsWith(
                      '000000000000000000000000000000000'
                    )
                      ? 'MINT'
                      : event.event.event_data.event_type.toUpperCase()}
                  </span>
                </div>
                <div className='event-item'>
                  <span style={{ fontWeight: 'bolder', fontSize: '1rem' }}>
                    Amount:
                  </span>{' '}
                  <NumberFormat
                    value={+event.event.event_data.amount / 1000000}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'Lib: '}
                    renderText={value => <span>{value}</span>}
                  />
                </div>
              </div>
              <div className='event-address'>
                <span style={{ fontWeight: 'bold' }}>
                  {event.event.event_data.event_type === 'sent' ? 'To' : 'From'}
                  :
                </span>{' '}
                {event.event.event_data.address}
              </div>
            </CardDetail>
          </Card>
          // </Waypoint>
        ))}

      {/* <div ref={setObservedEl}>Loading more...</div> */}
    </Div>
  )
}

export default EventsList
