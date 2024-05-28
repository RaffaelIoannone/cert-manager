"use client";
import React, { ReactNode } from "react";

const CopyButton = ({ children, value }: { children: ReactNode; value: string }) => {
  return (
    <button
      className="bg-blue-500 w-full rounded px-4 py-2 text-white font-semibold"
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText(value);
      }}
    >
      {children}
    </button>
  );
};

export default CopyButton;
