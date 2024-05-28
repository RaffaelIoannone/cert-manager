"use client";

import { MenuItem } from "@/types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavigationbarMenuItem = ({
  item,
  toggle,
}: {
  item: MenuItem;
  toggle: any;
}) => {
  const pathname = usePathname();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <div>
      {item.submenu ? (
        <>
          <li>
            <button onClick={toggleSubmenu} className="flex w-full text-2xl">
              <div className="flex flex-row justify-between w-full items-center">
                <span
                  className={`${pathname.includes(item.path) && "font-bold"}`}
                >
                  {item.title}
                </span>

                <div className={`${submenuOpen && "rotate-180"}`}>
                  <ChevronDownIcon width="24" height="24" />
                </div>
              </div>
            </button>
          </li>
          {submenuOpen && (
            <div className="mt-2 ml-2 flex flex-col space-y-2">
              {item.submenuItems?.map((subItem, idx) => (
                <li key={idx}>
                  <Link
                    href={subItem.path}
                    onClick={toggle}
                    className={`${subItem.path === pathname && "font-bold"}`}
                  >
                    {subItem.title}
                  </Link>
                </li>
              ))}
            </div>
          )}
        </>
      ) : (
        <li>
          <Link
            href={item.path}
            onClick={toggleSubmenu}
            className={`flex w-full text-2xl ${
              item.path === pathname && "font-bold"
            }`}
          >
            {item.title}
          </Link>
        </li>
      )}
    </div>
  );
};

export default NavigationbarMenuItem;
