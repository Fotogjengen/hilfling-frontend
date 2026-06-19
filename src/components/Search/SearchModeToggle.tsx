import { Image, LayoutGrid } from "lucide-react";
import {
  ToggleTabs,
  ToggleTabsList,
  ToggleTabsTrigger,
} from "../ui/input/ToggleTabs";
import { SearchMode } from "../../types";

type SearchModeToggleProps = {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
};

const options: { mode: SearchMode; label: string; icon: typeof Image }[] = [
  { mode: "images", label: "Bilder", icon: Image },
  { mode: "events", label: "Arrangementer", icon: LayoutGrid },
];

export default function SearchModeToggle({
  mode,
  onModeChange,
}: SearchModeToggleProps) {
  return (
    <ToggleTabs
      value={mode}
      onValueChange={(value) => onModeChange(value as SearchMode)}
    >
      <ToggleTabsList>
        {options.map(({ mode: optionMode, label, icon: Icon }) => (
          <ToggleTabsTrigger key={optionMode} value={optionMode}>
            {label}
            <Icon size={18} />
          </ToggleTabsTrigger>
        ))}
      </ToggleTabsList>
    </ToggleTabs>
  );
}
