"use client";

import { useCallback } from "react";
import { usePaginatedAsyncResource } from "@/app/hooks/use-paginated-async-resource";
import {
  CUSTOMERS_PAGE_SIZE,
  getCustomers,
  type CustomerRecord,
  type PaginatedCustomersResponse,
} from "@/app/services/customer/get-customers";

export function useCustomers(enabled = true) {
  const fetchPage = useCallback(
    (page: number) => getCustomers(page, CUSTOMERS_PAGE_SIZE),
    [],
  );

  return usePaginatedAsyncResource<
    CustomerRecord,
    PaginatedCustomersResponse["meta"]
  >(enabled, fetchPage, [enabled], {
    fallbackError: "Could not load guests.",
  });
}
