"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { AccountList } from "@/components/AccountList";

const DashboardPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-full bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Open Bank</h1>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            יציאה
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <AccountList />
      </main>
    </div>
  );
};

export default DashboardPage;
