"use client";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const BackButton = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  return (
    <button
      className="bg-slate-300 w-full rounded px-8 py-4 mt-7 text-white font-semibold "
      onClick={(e) => {
        e.preventDefault();
        router.back()
      }}
    >
      {children}
    </button>
  );
};

export default BackButton;
