'use client';

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import MustChangePasswordGuard from "@/components/authGuards/MustChangePasswordGuard";

export default function AppProvider({ children }: { children: React.ReactNode }) {

  return (
    <SessionProvider>
      <MustChangePasswordGuard>
        {children}
      </MustChangePasswordGuard>

      <Toaster position='top-right' />
    </SessionProvider>
  );

}