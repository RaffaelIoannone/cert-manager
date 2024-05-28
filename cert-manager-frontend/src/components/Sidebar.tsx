import { menuItems } from "@/constants";
import Link from "next/link";
import SidebarMenuItem from "./SidebarMenuItem";

const Sidebar = () => {
  return (
    <aside className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
        >
          <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
          <span className="font-bold text-xl hidden md:flex">Logo</span>
        </Link>

        <nav className="flex flex-col space-y-2  md:px-6 ">
          {menuItems.map((item, idx) => (
            <SidebarMenuItem key={idx} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;


