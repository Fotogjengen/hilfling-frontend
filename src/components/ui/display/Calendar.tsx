import { DayPicker, Matcher } from "react-day-picker";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import "react-day-picker/style.css";
import styles from "./Calendar.module.css";
import { nb } from "date-fns/locale";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
}

function CalendarChevron({ orientation }: { orientation?: string }) {
  if (orientation === "left") return <ChevronLeft size={16} />;
  if (orientation === "right") return <ChevronRight size={16} />;
  return <ChevronDown size={16} />;
}

export function Calendar({ selected, onSelect, disabled }: CalendarProps) {
  return (
    <DayPicker
      locale={nb}
      mode="single"
      selected={selected}
      defaultMonth={selected}
      onSelect={onSelect}
      disabled={disabled}
      captionLayout="dropdown"
      navLayout="around"
      showOutsideDays
      components={{ Chevron: CalendarChevron }}
      classNames={{
        weekday: styles.weekday,
        day_button: styles.dayButton,
        selected: styles.selected,
        today: styles.today,
        outside: styles.outside,
        disabled: styles.disabled,
      }}
    />
  );
}
