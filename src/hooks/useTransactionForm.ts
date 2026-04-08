"use client";

import { useState } from "react";
import { useCreateTransaction } from "@/hooks/useTransactions";

export const useTransactionForm = (
  accountId: string,
  type: "deposit" | "withdraw",
  onClose: () => void
) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useCreateTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    mutation.mutate(
      { accountId, data: { type, amount: parsed, description: description.trim() || undefined } },
      { onSuccess: onClose }
    );
  };

  return {
    amount,
    setAmount,
    description,
    setDescription,
    isPending: mutation.isPending,
    error: mutation.error,
    handleSubmit,
  };
};
