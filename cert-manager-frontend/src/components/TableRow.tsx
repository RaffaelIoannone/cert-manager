"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const TableRow = ({ children, id, path }: { children: ReactNode; id: string; path?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  return <tr className="cursor-pointer hover:bg-zinc-200" onClick={() => router.push(`${path ?? pathname}/${id}`)}>{children}</tr>;
};

export default TableRow;
