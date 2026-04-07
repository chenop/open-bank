"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePinChange = (value: string) => {
    setPin(value.replace(/\D/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "שגיאה בהתחברות");
        return;
      }

      login(data.token);
      router.push("/dashboard");
    } catch {
      setError("שגיאה בהתחברות");
    } finally {
      setLoading(false);
    }
  };

  return {
    pin,
    error,
    loading,
    handlePinChange,
    handleSubmit,
    canSubmit: pin.length >= 4 && !loading,
  };
};
