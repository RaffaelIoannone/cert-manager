"use client";
import { signIn, useSession } from "next-auth/react";
import React, { ReactNode, useEffect } from "react";

const SessionGuard = ({ children }: { children: ReactNode }) => {
  const { data } = useSession();
  useEffect(() => {
    if (data?.error === "RefreshAccessTokenError") {
      signIn("keycloak");
    }
  }, [data]);
  return <>{children}</>;
};

export default SessionGuard;
