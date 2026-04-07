"use client";

import { QueryProvider } from "./QueryProvider";
import { AuthProvider } from "./AuthProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <AuthProvider>{children}</AuthProvider>
  </QueryProvider>
);
