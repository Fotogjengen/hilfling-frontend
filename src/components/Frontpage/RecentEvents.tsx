import { useMotives } from "@/hooks/motive";
import EventCard, {
  EventCardSkeleton,
} from "@/components/ui/display/EventCard";
import SectionHeader from "@/components/ui/display/SectionHeader";
import styles from "./RecentEvents.module.css";

export default function RecentEvents() {
  const { data: motives, isPending } = useMotives();

  if (isPending) {
    return (
      <section className={styles.section}>
        <SectionHeader title="Nylige arrangementer" linkTo="/photos" />
        <div className={styles.scroll}>
          {[1, 2, 3].map((i) => (
            <EventCardSkeleton key={i} size="large" />
          ))}
        </div>
      </section>
    );
  }

  const allMotives = motives?.pages.flatMap((page) => page.currentList) ?? [];

  return (
    <section className={styles.section}>
      <SectionHeader title="Nylige arrangementer" linkTo="/photos" />
      <div className={styles.scroll}>
        {allMotives.map((motive) => (
          <div key={motive.motiveId.id} className={styles.cardWrapper}>
            <EventCard motive={motive} size="large" />
          </div>
        ))}
      </div>
    </section>
  );
}
