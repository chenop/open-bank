"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useAccountDetail } from "@/hooks/useAccountDetail";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS" }).format(amount);

const AccountDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { account, balance, transactions, isLoading, transactionType, openDeposit, openWithdraw, closeForm } =
    useAccountDetail(id);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-24">
        <p className="text-muted-foreground">חשבון לא נמצא</p>
        <Link href="/dashboard" className="text-primary underline mt-2 inline-block">
          חזרה לדשבורד
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← חזרה
          </Link>
          <Avatar size="lg">
            <AvatarFallback style={{ backgroundColor: account.avatarColor, color: "white" }}>
              {account.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">{account.name}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Balance Card */}
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-1">יתרה</p>
            <p className="text-4xl font-bold tabular-nums">{formatCurrency(balance)}</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1" onClick={openDeposit}>
            הפקדה
          </Button>
          <Button className="flex-1" variant="outline" onClick={openWithdraw}>
            משיכה
          </Button>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">תנועות</h2>
          <TransactionList transactions={transactions} />
        </div>
      </main>

      {transactionType && (
        <TransactionForm accountId={id} type={transactionType} onClose={closeForm} />
      )}
    </div>
  );
};

export default AccountDetailPage;
