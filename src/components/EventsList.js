import React, { useContext, useState, useEffect } from "react";
import { format } from "date-fns";
// import { Waypoint } from 'react-waypoint'
import NumberFormat from "react-number-format";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

import { useQueryEvents, QueryContext, ActivityContext } from "../hooks";

const useStyles = makeStyles({
  card: {
    maxHeight: 80,
    margin: "auto",
    padding: 0
  },
  content: {
    maxWidth: "100%"
  }
});

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

  .no-activity {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    /* margin-top: 2rem; */
  }

  .load-more {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    margin: 2rem 0;
  }
`;

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
`;

const EventsList = () => {
  const classes = useStyles();
  const { accountState } = useContext(QueryContext);
  const { events, queryEventsLoading, isNoEvents } = useQueryEvents(
    accountState && accountState.address
  );
  const { showEvents } = useContext(ActivityContext);
  const [displayedEvents, setDisplayedEvents] = useState(events.slice(0, 3));
  const [observedEl, setObservedEl] = useState(null);

  // const transitions = useTransition(showEvents, null, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 }
  // });

  useEffect(() => {
    setDisplayedEvents(events.slice(0, 3));
  }, [events]);

  const loadMore = () => {
    setTimeout(() => {
      setDisplayedEvents([
        ...displayedEvents,
        ...events.slice(
          displayedEvents.length,
          events.length - displayedEvents.length > 3
            ? displayedEvents.length + 3
            : events.length
        )
      ]);
    }, 500);
  };

  const observer = new IntersectionObserver(
    items => {
      if (items[0].isIntersecting) {
        // loadmore if more events
        if (events.length > displayedEvents.length) {
          loadMore();
        }
      }
    },
    { threshold: 1 }
  );

  useEffect(() => {
    if (observedEl) {
      observer.observe(observedEl);
    }

    return () => {
      if (observedEl) {
        observer.unobserve(observedEl);
      }
    };
  }, [observedEl, observer, events]);

  return (
    <>
      {showEvents && (
        <Div>
          {/* {!isNoEvents && queryEventsLoading && <Loader />} */}

          {isNoEvents && !queryEventsLoading && (
            <p className="no-activity">No activity</p>
          )}

          {displayedEvents &&
            displayedEvents.length > 0 &&
            displayedEvents.map(
              (event, i) => (
                // <Waypoint
                //   onEnter={() => loadMoreEvents(i)}
                //   onLeave={onLeaveHandler}
                // >

                <Card
                  className={`event ${classes.card}`}
                  key={`${event.expiration_time}/${event.transaction_version}/${event.event.event_data.event_type}`}
                >
                  <CardDetail className={classes.content}>
                    <div className="event-details">
                      <div className="event-item">
                        <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                        <span>
                          {format(
                            new Date(+event.expiration_time * 1000),
                            "dd-MMM-yyyy: hh:mm a"
                          )}
                        </span>
                      </div>
                      <div className="event-item">
                        <span style={{ fontWeight: "bold" }}>TxnVersion:</span>{" "}
                        <span>{event.transaction_version}</span>
                      </div>
                      <div className="event-item">
                        <span
                          style={{
                            fontWeight: "bold"
                          }}
                        >
                          Type:
                        </span>{" "}
                        <span
                          style={{
                            fontWeight: "bolder",
                            color: `${
                              event.event.event_data.address.startsWith(
                                "000000000000000000000000000000000"
                              )
                                ? "blue"
                                : event.event.event_data.event_type ===
                                  "received"
                                ? "green"
                                : "red"
                            }`
                          }}
                        >
                          {event.event.event_data.address.startsWith(
                            "000000000000000000000000000000000"
                          )
                            ? "MINT"
                            : event.event.event_data.event_type.toUpperCase()}
                        </span>
                      </div>
                      <div className="event-item">
                        <span
                          style={{ fontWeight: "bolder", fontSize: "1rem" }}
                        >
                          Amount:
                        </span>{" "}
                        <NumberFormat
                          value={+event.event.event_data.amount / 1000000}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"Lib: "}
                          renderText={value => <span>{value}</span>}
                        />
                      </div>
                    </div>
                    <div className="event-address">
                      <span style={{ fontWeight: "bold" }}>
                        {event.event.event_data.event_type === "sent"
                          ? "To"
                          : "From"}
                        :
                      </span>{" "}
                      {event.event.event_data.address}
                    </div>
                  </CardDetail>
                </Card>
              )
              // </Waypoint>
            )}

          {(events.length > displayedEvents.length || queryEventsLoading) && (
            <div ref={setObservedEl} className="load-more">
              Loading activities...
            </div>
          )}
        </Div>
      )}
    </>
  );
};

export default EventsList;
