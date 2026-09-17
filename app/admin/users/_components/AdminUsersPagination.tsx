import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils/common";

import { IPaginationData } from "./types";

interface AdminUsersPaginationProps {
  pagination: IPaginationData;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

const limitOptions = [5, 10, 20, 50];

const AdminUsersPagination = ({
  pagination,
  onPageChange,
  onLimitChange,
}: AdminUsersPaginationProps) => {

  const { page, limit, total, totalPages, hasNextPage, hasPreviousPage } =
    pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const prevButtonAttributes = {
    type: "button" as const,
    onClick: () => onPageChange(page - 1),
    disabled: !hasPreviousPage,
    className: cn(
      "flex items-center justify-center p-2 rounded-lg border transition-all duration-150",
      hasPreviousPage
        ? "border-white/10 bg-dark-200/60 text-light-100 hover:text-white hover:border-primary/40 cursor-pointer"
        : "border-white/5 bg-dark-200/20 text-light-200/30 cursor-not-allowed"
    ),
    "aria-label": "Previous page",
  };

  const nextButtonAttributes = {
    type: "button" as const,
    onClick: () => onPageChange(page + 1),
    disabled: !hasNextPage,
    className: cn(
      "flex items-center justify-center p-2 rounded-lg border transition-all duration-150",
      hasNextPage
        ? "border-white/10 bg-dark-200/60 text-light-100 hover:text-white hover:border-primary/40 cursor-pointer"
        : "border-white/5 bg-dark-200/20 text-light-200/30 cursor-not-allowed"
    ),
    "aria-label": "Next page",
  };

  const limitSelectAttributes = {
    value: limit,
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
      onLimitChange(Number(e.target.value)),
    className:
      "bg-dark-200/80 text-light-100 text-xs rounded-lg px-2.5 py-1.5 border border-white/10 focus:border-primary/50 focus:outline-none cursor-pointer",
  };

  function renderPageNumbers() {

    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center gap-1.5">
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs font-mono font-medium text-light-200 hover:text-white hover:bg-dark-200/60 transition-colors border border-transparent cursor-pointer"
            >
              1
            </button>

            {start > 2 && <span className="text-light-200/50 px-1 text-xs">…</span>}
          </>
        )}

        {pages.map((p) => {

          const isCurrent = p === page;

          const buttonAttributes = {
            type: "button" as const,
            onClick: () => onPageChange(p),
            className: cn(
              "w-8 h-8 rounded-lg text-xs font-mono font-medium transition-all duration-150 border cursor-pointer",
              isCurrent
                ? "bg-primary text-black font-bold border-primary shadow-[0_0_10px_rgba(93,254,202,0.3)]"
                : "text-light-200 hover:text-white hover:bg-dark-200/60 border-white/5"
            ),
          };

          return (
            <button key={p} {...buttonAttributes}>
              {p}
            </button>
          );

        })}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-light-200/50 px-1 text-xs">…</span>}

            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-lg text-xs font-mono font-medium text-light-200 hover:text-white hover:bg-dark-200/60 transition-colors border border-transparent cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    );

  }

  function renderCountInfo() {

    return (
      <div className="text-xs text-light-200 font-mono">
        Showing <span className="text-white font-medium">{startItem}</span> to{" "}
        <span className="text-white font-medium">{endItem}</span> of{" "}
        <span className="text-white font-medium">{total}</span> users
      </div>
    );

  }

  function renderLimitSelector() {

    return (
      <div className="flex items-center gap-2 text-xs text-light-200">
        <span>Rows:</span>

        <select {...limitSelectAttributes}>
          {limitOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-dark-100 text-white">
              {opt}
            </option>
          ))}
        </select>
      </div>
    );

  }

  function renderNavigationControls() {

    return (
      <div className="flex items-center gap-2">
        <button {...prevButtonAttributes}>
          <ChevronLeft className="w-4 h-4" />
        </button>

        {renderPageNumbers()}

        <button {...nextButtonAttributes}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );

  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-border-dark bg-dark-200/20 rounded-b-2xl">

      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">

        {renderCountInfo()}

        {renderLimitSelector()}

      </div>

      <div className="flex items-center justify-center">

        {renderNavigationControls()}

      </div>

    </div>
  );

};

export default AdminUsersPagination;
