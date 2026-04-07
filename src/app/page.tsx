"use client";

import { useLogin } from "@/hooks/useLogin";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const LoginPage = () => {
  const { pin, error, loading, handlePinChange, handleSubmit, canSubmit } = useLogin();

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-sm w-full">
        <CardContent>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Open Bank</h1>
          <p className="text-gray-600 text-center mb-6">הזן קוד PIN להתחברות</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="קוד PIN"
              className="w-full text-center text-2xl tracking-[0.5em] rounded-lg border border-gray-300 px-3 py-3
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {loading ? <Spinner size="sm" /> : "כניסה"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
