"use client";

import { useState } from "react";
import { useAccounts, useDeleteAccount } from "./useAccounts";
import type { IAccount } from "@/models/Account";

export const useAccountList = () => {
  const { data: accounts, isLoading } = useAccounts();
  const deleteMutation = useDeleteAccount();
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<IAccount | null>(null);

  const openCreateForm = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const openEditForm = (account: IAccount) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleDelete = (account: IAccount) => {
    if (confirm(`למחוק את ${account.name}?`)) {
      deleteMutation.mutate(String(account._id));
    }
  };

  return {
    accounts: accounts || [],
    isLoading,
    showForm,
    editingAccount,
    openCreateForm,
    openEditForm,
    closeForm,
    handleDelete,
  };
};
