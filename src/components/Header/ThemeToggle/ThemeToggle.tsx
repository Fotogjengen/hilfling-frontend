import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Bytt til lyst tema" : "Bytt til mørkt tema"
      }
    >
      {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}

export default ThemeToggle;
