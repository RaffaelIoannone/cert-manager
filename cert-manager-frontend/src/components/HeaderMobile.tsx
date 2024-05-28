"use client";

import { menuItems } from "@/constants";
import React, { useState } from "react";
import ToggleButton from "./ToggleButton";
import NavigationbarMenuItem from "./NavigationbarMenuItem";

const HeaderMobile = () => {
  const [isMobileHeaderOpen, setIsMobileHeaderOpen] = useState(false);
  const toggleSubmenu = () => {
    setIsMobileHeaderOpen(!isMobileHeaderOpen);
  };
  return (
    <nav
      className={`fixed inset-0 z-50 w-full md:hidden ${
        isMobileHeaderOpen ? "" : "pointer-events-none"
      }`}
    >
      <div className={`${!isMobileHeaderOpen && "hidden"}`}>
        <div className="absolute inset-0 right-0 w-full bg-white" />
        <ul className="absolute flex flex-col w-full gap-3 px-10 py-16">
          {menuItems.map((item, idx) => {
            const isLastItem = idx === menuItems.length - 1;
            return (
              <div key={idx}>
                <NavigationbarMenuItem item={item} toggle={toggleSubmenu} />
                {!isLastItem && <li className="my-3 h-px w-full bg-gray-300" />}
              </div>
            );
          })}
        </ul>
      </div>

      <ToggleButton toggle={toggleSubmenu} isOpen={isMobileHeaderOpen} />
    </nav>
  );
};

export default HeaderMobile;
