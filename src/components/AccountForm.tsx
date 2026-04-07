"use client";

import { useAccountForm } from "@/hooks/useAccountForm";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { IAccount } from "@/models/Account";

interface Props {
  account: IAccount | null;
  onClose: () => void;
}

export const AccountForm = ({ account, onClose }: Props) => {
  const {
    isEdit,
    name,
    setName,
    color,
    setColor,
    avatarColors,
    isPending,
    error,
    handleSubmit,
  } = useAccountForm(account, onClose);

  return (
    <Dialog open onClose={onClose} title={isEdit ? "עריכת חשבון" : "חשבון חדש"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          label="שם"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">צבע</label>
          <div className="flex gap-2 flex-wrap">
            {avatarColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform ${
                  color === c ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "שגיאה"}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            ביטול
          </Button>
          <Button type="submit" disabled={!name.trim() || isPending}>
            {isEdit ? "שמירה" : "יצירה"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
