"use client";

import { useLogin } from "@/hooks/useLogin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const LoginPage = () => {
  const { pin, error, loading, handlePinChange, handleSubmit, canSubmit } = useLogin();

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/50 p-4">
      <Card className="max-w-sm w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Open Bank</CardTitle>
          <p className="text-muted-foreground">הזן קוד PIN להתחברות</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="קוד PIN"
              className="text-center text-2xl tracking-[0.5em] h-12"
              autoFocus
            />

            {error && <p className="text-sm text-destructive text-center">{error}</p>}

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
