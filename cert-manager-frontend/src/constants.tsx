import { ArrowRightStartOnRectangleIcon, Cog6ToothIcon, FolderIcon, HomeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { MenuItem } from "./types";

export const backend = process.env.BACKEND_URL;

export const adminRole = "cert-manager-admin";

export const menuItems: MenuItem[] = [
    {
        title: "Home",
        path: "/",
        icon: <HomeIcon width="24" height="24" />
    },
    {
        title: "Certificates",
        path: "/certificates",
        icon: <ShieldCheckIcon width="24" height="24" />,
        submenu: true,
        submenuItems: [
            {title: "All certificates", path: "/certificates"},
            {title: "Create certificate", path: "/certificates/create"},
            {title: "Archive (revoked)", path: "/certificates/revoked"},
        ]
    },
    {
        title: "Keystores",
        path: "/keystores",
        icon: <FolderIcon width="24" height="24" />,
        submenu: true,
        submenuItems: [
            {title: "All keystores", path: "/keystores"},
            {title: "Create keystore", path: "/keystores/create"},
        ]
    },
    {
        title: "Logout",
        path: "/logout",
        icon: <ArrowRightStartOnRectangleIcon width="24" height="24" />
    }
]