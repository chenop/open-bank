"use client";

import type { ITransaction, TransactionType } from "@/models/Transaction";
import { Card, CardContent } from "@/components/ui/card";

const TYPE_CONFIG: Record<TransactionType, { label: string; color: string; bg: string }> = {
  deposit: { label: "הפקדה", color: "text-green-700", bg: "bg-green-100" },
  withdraw: { label: "משיכה", color: "text-red-700", bg: "bg-red-100" },
  invest: { label: "השקעה", color: "text-blue-700", bg: "bg-blue-100" },
  uninvest: { label: "פדיון", color: "text-blue-700", bg: "bg-blue-100" },
  buy_security: { label: "קנייה", color: "text-purple-700", bg: "bg-purple-100" },
  sell_security: { label: "מכירה", color: "text-purple-700", bg: "bg-purple-100" },
  interest: { label: "ריבית", color: "text-amber-700", bg: "bg-amber-100" },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(Math.abs(amount));

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("he-IL", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  transactions: ITransaction[];
}

export const TransactionList = ({ transactions }: Props) => {
  if (transactions.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <p className="text-muted-foreground">אין תנועות עדיין</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => {
        const config = TYPE_CONFIG[tx.type];
        const isPositive = tx.amount > 0;

        return (
          <Card key={String(tx._id)}>
            <CardContent className="flex items-center gap-3 py-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
                {config.label}
              </span>
              <div className="flex-1 min-w-0">
                {tx.description && (
                  <p className="text-sm truncate">{tx.description}</p>
                )}
                <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
              </div>
              <span className={`font-semibold tabular-nums ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
