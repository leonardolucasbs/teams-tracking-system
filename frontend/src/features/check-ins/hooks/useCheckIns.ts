"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  CHECK_INS_QUERY_KEY,
  defaultCheckInFilters,
} from "@/features/check-ins/constants/check-in-constants";
import {
  createCheckIn,
  findCheckIns,
  syncCheckIns,
} from "@/features/check-ins/services/check-ins-service";
import { checkInFiltersSchema } from "@/features/check-ins/schemas/checkInSchema";
import type { CheckInFilters } from "@/features/check-ins/types/check-in-types";
import { TOAST_MESSAGES } from "@/constants/toast-constants";
import { useToast } from "@/hooks/useToast";

export function useCheckIns() {
  const queryClient = useQueryClient();
  const { showSuccessToast } = useToast();
  const [filters, setFilters] =
    useState<CheckInFilters>(defaultCheckInFilters);
  const [submittedFilters, setSubmittedFilters] =
    useState<CheckInFilters>(defaultCheckInFilters);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const checkInsQuery = useQuery({
    queryKey: [...CHECK_INS_QUERY_KEY, submittedFilters],
    queryFn: () => findCheckIns(submittedFilters),
  });

  const createMutation = useMutation({
    mutationFn: createCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECK_INS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.success);
      closeForm();
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncCheckIns,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECK_INS_QUERY_KEY });
      showSuccessToast(TOAST_MESSAGES.success);
    },
  });

  return {
    checkIns: checkInsQuery.data ?? [],
    filters,
    isFormOpen,
    isLoading: checkInsQuery.isLoading,
    isError: checkInsQuery.isError || syncMutation.isError,
    isSubmitting: createMutation.isPending,
    isSyncing: syncMutation.isPending,
    setFilters,
    submitFilters,
    openForm,
    closeForm,
    createCheckIn: createMutation.mutate,
    syncCheckIns: syncMutation.mutate,
  };

  function submitFilters() {
    const parsedFilters = checkInFiltersSchema.safeParse(filters);

    if (parsedFilters.success) {
      setSubmittedFilters(parsedFilters.data);
    }
  }

  function openForm() {
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
  }
}
