"use client";

import { useState } from "react";
import { useAccount } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";

export const useAccountDetail = (id: string) => {
  const { data: account, isLoading: accountLoading } = useAccount(id);
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(id);

  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw" | null>(null);

  const openDeposit = () => setTransactionType("deposit");
  const openWithdraw = () => setTransactionType("withdraw");
  const closeForm = () => setTransactionType(null);

  return {
    account,
    balance: transactionsData?.balance ?? 0,
    transactions: transactionsData?.transactions ?? [],
    isLoading: accountLoading || transactionsLoading,
    transactionType,
    openDeposit,
    openWithdraw,
    closeForm,
  };
};
