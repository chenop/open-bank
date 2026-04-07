"use client";

import { useState } from "react";
import { useCreateAccount, useUpdateAccount } from "./useAccounts";
import type { IAccount } from "@/models/Account";

const AVATAR_COLORS = [
  "#3B82F6", "#EF4444", "#10B981", "#F59E0B",
  "#8B5CF6", "#EC4899", "#06B6D4", "#F97316",
];

export const useAccountForm = (account: IAccount | null, onClose: () => void) => {
  const isEdit = !!account;
  const [name, setName] = useState(account?.name || "");
  const [color, setColor] = useState(account?.avatarColor || AVATAR_COLORS[0]);

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const mutation = isEdit ? updateMutation : createMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = { name: name.trim(), avatarColor: color };

    if (isEdit) {
      updateMutation.mutate({ id: String(account._id), data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  };

  return {
    isEdit,
    name,
    setName,
    color,
    setColor,
    avatarColors: AVATAR_COLORS,
    isPending: mutation.isPending,
    error: mutation.error,
    handleSubmit,
  };
};
