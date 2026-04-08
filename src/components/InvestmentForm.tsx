"use client";

import { useInvestmentForm } from "@/hooks/useInvestmentForm";
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
  onClose: () => void;
}

export const InvestmentForm = ({ accountId, onClose }: Props) => {
  const { amount, setAmount, rate, setRate, isPending, error, handleSubmit } =
    useInvestmentForm(accountId, onClose);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>השקעה חדשה</DialogTitle>
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
            <label className="text-sm font-medium">ריבית שנתית (%)</label>
            <Input
              type="number"
              min="1"
              max="99"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              required
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
              השקעה
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
