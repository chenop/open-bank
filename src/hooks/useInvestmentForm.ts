"use client";

import { useState } from "react";
import { useCreateInvestment } from "@/hooks/useInvestments";

export const useInvestmentForm = (accountId: string, onClose: () => void) => {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("5");
  const mutation = useCreateInvestment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const parsedRate = parseFloat(rate) / 100;
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (isNaN(parsedRate) || parsedRate <= 0 || parsedRate >= 1) return;

    mutation.mutate(
      { accountId, data: { principalAmount: parsedAmount, annualRate: parsedRate } },
      { onSuccess: onClose }
    );
  };

  return {
    amount,
    setAmount,
    rate,
    setRate,
    isPending: mutation.isPending,
    error: mutation.error,
    handleSubmit,
  };
};
