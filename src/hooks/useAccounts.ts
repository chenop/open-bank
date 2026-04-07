"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/providers/AuthProvider";
import type { IAccount } from "@/models/Account";

export const useAccounts = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<IAccount[]>({
    queryKey: ["accounts"],
    queryFn: () => apiFetch("/api/accounts"),
    enabled: isAuthenticated,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; avatarColor: string }) =>
      apiFetch("/api/accounts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; avatarColor: string } }) =>
      apiFetch(`/api/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/accounts/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
};
