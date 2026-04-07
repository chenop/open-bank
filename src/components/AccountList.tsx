"use client";

import { useAccountList } from "@/hooks/useAccountList";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
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
        <h2 className="text-lg font-semibold text-gray-900">חשבונות</h2>
        <Button size="sm" onClick={openCreateForm}>
          חשבון חדש +
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">אין חשבונות עדיין</p>
          <Button size="sm" variant="ghost" className="mt-2" onClick={openCreateForm}>
            צור חשבון ראשון
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <Card key={String(account._id)} className="flex items-center gap-4 p-4">
              <Avatar name={account.name} color={account.avatarColor} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{account.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEditForm(account)}>
                  עריכה
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(account)}>
                  מחיקה
                </Button>
              </div>
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
