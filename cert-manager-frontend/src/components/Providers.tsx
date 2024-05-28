"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return <SessionProvider refetchInterval={4 * 60}>{children}</SessionProvider>;
};

export default Providers;
