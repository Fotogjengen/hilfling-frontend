import React, { FC } from "react";
import { Link } from "react-router-dom";

import styles from "./EventCards.module.css";
import { EventCardDto } from "../../../../generated";

interface Props {
  event: string;
  eventCardResponse: EventCardDto[];
}

const EventCards: FC<Props> = ({ event, eventCardResponse }) => {
  if (!eventCardResponse || eventCardResponse.length === 0) {
    return <div className={styles.emptyState}>No {event} events found</div>;
  }
  return (
    <div className={styles.cardsContainer}>
      {eventCardResponse.map((eventCard) => {
        const id = eventCard.motiveId || "default";
        return (
          <Link
            className={styles.card}
            key={`motive-card-${id}`}
            to={`/motive/${id}`}
          >
            <img
              className={styles.cardImg}
              src={eventCard.frontPageSmallPhotoUrl}
              alt="img"
            />

            <div className={styles.cardText}>
              <div className={styles.cardTextTitle}>
                {eventCard.motiveTitle}
              </div>
              <div>
                <b>Date:</b>
                {eventCard.date_created?.toString()}
                <br />
                <b>{eventCard.eventOwnerName}</b>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default EventCards;
