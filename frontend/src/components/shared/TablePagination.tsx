import { Button } from "@/components/ui/Button";
import type { TablePaginationProps } from "@/types/pagination-types";

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startItem,
  endItem,
  onPageChange,
}: TablePaginationProps) {
  if (totalItems <= pageSize) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        Mostrando {startItem}-{endItem} de {totalItems} registros
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span className="text-xs">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
