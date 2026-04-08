"use client";

import { useAccountForm } from "@/hooks/useAccountForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "עריכת חשבון" : "חשבון חדש"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">שם</label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">צבע</label>
            <div className="flex gap-2 flex-wrap">
              {avatarColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-offset-2 ring-ring scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "שגיאה"}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isEdit ? "שמירה" : "יצירה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
