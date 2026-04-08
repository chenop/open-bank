"use client";

import { useTransactionForm } from "@/hooks/useTransactionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  accountId: string;
  type: "deposit" | "withdraw";
  onClose: () => void;
}

const LABELS = {
  deposit: { title: "הפקדה", submit: "הפקדה" },
  withdraw: { title: "משיכה", submit: "משיכה" },
} as const;

export const TransactionForm = ({ accountId, type, onClose }: Props) => {
  const { amount, setAmount, description, setDescription, isPending, error, handleSubmit } =
    useTransactionForm(accountId, type, onClose);

  const labels = LABELS[type];

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">סכום</label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">תיאור (אופציונלי)</label>
            <Input
              placeholder="תיאור התנועה"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
            <Button type="submit" disabled={!amount || isPending}>
              {labels.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
