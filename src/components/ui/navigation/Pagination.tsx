import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";
import { Button } from "../input/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  const neighbors = new Set([
    1,
    2,
    current - 1,
    current,
    current + 1,
    total - 1,
    total,
  ]);

  let prev: number | null = null;
  for (const page of Array.from(neighbors).sort((a, b) => a - b)) {
    if (page < 1 || page > total) continue;
    if (prev !== null && page - prev > 1) pages.push("...");
    pages.push(page);
    prev = page;
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className={styles.nav}>
      <Button
        variant="subtle"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "subtle"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="subtle"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </nav>
  );
}
