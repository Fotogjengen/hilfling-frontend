import { ReactNode } from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import styles from "./DataTable.module.css";

type ColumnClassNames = {
  header?: string;
  cell?: string;
};

type DataTableProps<TData> = {
  table: Table<TData>;
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  columnClassNames?: Record<string, ColumnClassNames | undefined>;
  className?: string;
};

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") {
    return <ArrowUp size={14} aria-hidden="true" />;
  }
  if (direction === "desc") {
    return <ArrowDown size={14} aria-hidden="true" />;
  }
  return (
    <ArrowUpDown size={14} aria-hidden="true" className={styles.sortIconIdle} />
  );
}

export function DataTable<TData>({
  table,
  isLoading = false,
  isError = false,
  emptyMessage,
  errorMessage,
  columnClassNames,
  className,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;

  return (
    <div className={className}>
      <div className={styles.tableScroller}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={columnClassNames?.[header.column.id]?.header}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className={styles.sortButton}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <SortIndicator direction={sorted} />
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={columnClassNames?.[cell.column.id]?.cell}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && rows.length === 0 && emptyMessage && (
        <p className={styles.emptyState}>{emptyMessage}</p>
      )}
      {isError && errorMessage && (
        <p className={styles.emptyState}>{errorMessage}</p>
      )}
    </div>
  );
}
