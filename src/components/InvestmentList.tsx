"use client";

import type { IInvestment } from "@/models/Investment";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvestmentWithValue extends IInvestment {
  currentValue: number;
}

interface Props {
  investments: InvestmentWithValue[];
  onRedeem: (investmentId: string) => void;
  isRedeeming: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(amount);

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("he-IL", { day: "numeric", month: "short", year: "numeric" });

export const InvestmentList = ({ investments, onRedeem, isRedeeming }: Props) => {
  if (investments.length === 0) {
    return (
      <Card className="py-12">
        <CardContent className="text-center">
          <p className="text-muted-foreground">אין השקעות עדיין</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {investments.map((inv) => {
        const isRedeemed = !!inv.redeemedAt;
        const gain = inv.currentValue - inv.principalAmount;

        return (
          <Card key={String(inv._id)} className={isRedeemed ? "opacity-60" : ""}>
            <CardContent className="py-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">
                    {formatCurrency(inv.principalAmount)}
                  </span>
                  <span className="text-xs text-muted-foreground mr-2">
                    ריבית {(inv.annualRate * 100).toFixed(0)}%
                  </span>
                </div>
                {!isRedeemed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRedeem(String(inv._id))}
                    disabled={isRedeeming}
                  >
                    פדיון
                  </Button>
                )}
                {isRedeemed && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    נפדה
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatDate(inv.startDate)}
                  {isRedeemed && ` → ${formatDate(inv.redeemedAt!)}`}
                </span>
                <div className="text-left">
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(inv.currentValue)}
                  </span>
                  {gain > 0.01 && (
                    <span className="text-xs text-green-600 mr-1">
                      +{formatCurrency(gain)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
