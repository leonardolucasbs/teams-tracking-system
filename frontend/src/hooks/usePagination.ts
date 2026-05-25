"use client";

import { useMemo, useState } from "react";
import { TABLE_PAGE_SIZE } from "@/constants/table-pagination";
import type { UsePaginationResult } from "@/types/pagination-types";

export function usePagination<T>(
  items: T[],
  pageSize = TABLE_PAGE_SIZE,
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectiveCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (effectiveCurrentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [effectiveCurrentPage, items, pageSize]);

  const startItem =
    totalItems === 0 ? 0 : (effectiveCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(effectiveCurrentPage * pageSize, totalItems);

  function setPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  return {
    paginatedItems,
    currentPage: effectiveCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    startItem,
    endItem,
    setPage,
  };
}
