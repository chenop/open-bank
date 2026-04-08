"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/providers/AuthProvider";
import type { ITransaction } from "@/models/Transaction";

interface TransactionsResponse {
  balance: number;
  transactions: ITransaction[];
}

export const useTransactions = (accountId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery<TransactionsResponse>({
    queryKey: ["transactions", accountId],
    queryFn: () => apiFetch(`/api/accounts/${accountId}/transactions`),
    enabled: isAuthenticated && !!accountId,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      data,
    }: {
      accountId: string;
      data: { type: "deposit" | "withdraw"; amount: number; description?: string };
    }) =>
      apiFetch(`/api/accounts/${accountId}/transactions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.accountId] });
    },
  });
};
