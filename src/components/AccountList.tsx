"use client";

import { useAccountList } from "@/hooks/useAccountList";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AccountForm } from "@/components/AccountForm";

export const AccountList = () => {
  const {
    accounts,
    isLoading,
    showForm,
    editingAccount,
    openCreateForm,
    openEditForm,
    closeForm,
    handleDelete,
  } = useAccountList();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">חשבונות</h2>
        <Button size="sm" onClick={openCreateForm}>
          חשבון חדש +
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">אין חשבונות עדיין</p>
            <Button size="sm" variant="ghost" className="mt-2" onClick={openCreateForm}>
              צור חשבון ראשון
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <Card key={String(account._id)}>
              <CardContent className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarFallback style={{ backgroundColor: account.avatarColor, color: "white" }}>
                    {account.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{account.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openEditForm(account)}>
                    עריכה
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(account)}>
                    מחיקה
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <AccountForm account={editingAccount} onClose={closeForm} />
      )}
    </div>
  );
};
