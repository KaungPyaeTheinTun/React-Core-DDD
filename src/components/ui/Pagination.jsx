import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  pageSize,
  totalCount,
  totalPages: totalPagesProp,
  onPageChange,
}) {
  const totalPages =
    totalPagesProp ?? (totalCount != null ? Math.ceil(totalCount / pageSize) : 1);

  if (totalPages <= 1) return null;

  function getPageNumbers() {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = Math.min(maxVisible, totalPages - 1);
      } else if (page >= totalPages - 2) {
        start = Math.max(totalPages - maxVisible + 1, 2);
        end = totalPages - 1;
      }

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  }

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-between border-t border-zinc-200 pt-4 mt-6">
      <p className="text-xs text-zinc-500 font-medium">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-black disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-zinc-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition ${
                p === page
                  ? "bg-black text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-black disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
