'use client';

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position='top-right' />
    </SessionProvider>
  );
}