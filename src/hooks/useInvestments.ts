"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/providers/AuthProvider";
import type { IInvestment } from "@/models/Investment";

interface InvestmentWithValue extends IInvestment {
  currentValue: number;
}

interface InvestmentsResponse {
  investments: InvestmentWithValue[];
}

export const useInvestments = (accountId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery<InvestmentsResponse>({
    queryKey: ["investments", accountId],
    queryFn: () => apiFetch(`/api/accounts/${accountId}/investments`),
    enabled: isAuthenticated && !!accountId,
  });
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      data,
    }: {
      accountId: string;
      data: { principalAmount: number; annualRate?: number };
    }) =>
      apiFetch(`/api/accounts/${accountId}/investments`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["investments", variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.accountId] });
    },
  });
};

export const useRedeemInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      investmentId,
    }: {
      accountId: string;
      investmentId: string;
    }) =>
      apiFetch(`/api/accounts/${accountId}/investments/${investmentId}`, {
        method: "PUT",
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["investments", variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.accountId] });
    },
  });
};
