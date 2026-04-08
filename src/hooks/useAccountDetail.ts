"use client";

import { useState } from "react";
import { useAccount } from "@/hooks/useAccounts";
import { useTransactions } from "@/hooks/useTransactions";
import { useInvestments, useRedeemInvestment } from "@/hooks/useInvestments";

export const useAccountDetail = (id: string) => {
  const { data: account, isLoading: accountLoading } = useAccount(id);
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(id);
  const { data: investmentsData, isLoading: investmentsLoading } = useInvestments(id);

  const [transactionType, setTransactionType] = useState<"deposit" | "withdraw" | null>(null);
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const redeemMutation = useRedeemInvestment();

  const openDeposit = () => setTransactionType("deposit");
  const openWithdraw = () => setTransactionType("withdraw");
  const closeTransactionForm = () => setTransactionType(null);

  const openInvestForm = () => setShowInvestmentForm(true);
  const closeInvestForm = () => setShowInvestmentForm(false);

  const handleRedeem = (investmentId: string) => {
    redeemMutation.mutate({ accountId: id, investmentId });
  };

  return {
    account,
    balance: transactionsData?.balance ?? 0,
    transactions: transactionsData?.transactions ?? [],
    investments: investmentsData?.investments ?? [],
    isLoading: accountLoading || transactionsLoading || investmentsLoading,
    transactionType,
    openDeposit,
    openWithdraw,
    closeTransactionForm,
    showInvestmentForm,
    openInvestForm,
    closeInvestForm,
    handleRedeem,
    isRedeeming: redeemMutation.isPending,
  };
};
