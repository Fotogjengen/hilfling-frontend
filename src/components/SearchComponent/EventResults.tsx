import EventCard, {
  EventCardSkeleton,
} from "@/components/ui/display/EventCard";
import { MotiveDto } from "../../../generated";
import styles from "./EventResults.module.css";

export function EventResultsSkeleton() {
  return (
    <div className={styles.grid}>
      {[0, 1, 2].map((i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

type EventResultsProps = {
  motives: MotiveDto[];
};

export default function EventResults({ motives }: EventResultsProps) {
  return (
    <div className={styles.grid}>
      {motives.map((motive) => (
        <EventCard key={motive.motiveId.id} motive={motive} />
      ))}
    </div>
  );
}
