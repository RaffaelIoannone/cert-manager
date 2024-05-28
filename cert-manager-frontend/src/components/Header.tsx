'use client';

import useScroll from "@/hook/use-scroll";
import Link from "next/link";
import React from "react";

const Header = () => {
  const scrolled = useScroll(5);
  return (
    <div
      className={`sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200 ${scrolled ? "bg-white/75 backdrop-blur-lg": "bg-white"}`}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
            <span className="font-bold text-xl flex ">Logo2</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
